<?php

/**
 * Admin Ajax page
 * handles sharing/unsharing drafts via XHR requests
 */
class Drafts_For_Friends_Admin_Ajax {

	/**
	*  Initializes class
	*/
	public function __construct() {
		add_action( 'wp_ajax_start_sharing_draft', array(__CLASS__, 'start_sharing_draft' ) );
		add_action( 'wp_ajax_stop_sharing_draft', array(__CLASS__, 'stop_sharing_draft' ) );
		add_action( 'wp_ajax_extend_sharing_draft', array(__CLASS__, 'extend_sharing_draft' ) );
		add_action( 'wp_ajax_get_drafts', array(__CLASS__, 'get_drafts' ) );
		add_action( 'wp_ajax_get_shared_drafts', array(__CLASS__, 'get_shared_drafts' ) );
	}

	private static function calc( $params ) {
		$expires = 60;
		$multiply = 60;

		if ( isset( $params['expires'] ) && ( $e = intval( $params['expires'] ) ) ) {
			$expires = $e;
		}
		$mults = array(
			's' => 1,
			'm' => 60,
			'h' => 3600,
			'd' => 24*3600
		);

		if ( $params['measure'] && $mults[ $params['measure'] ] ) {
			$multiply = $mults[ $params['measure'] ];
		}
		return $expires * $multiply;
	}

	/**
	 * Generic returning draft posts
	 * @return array of drafts
	 */
	public static function get_drafts() {
		check_ajax_referer( 'my_nonce', 'nonce' );

		global $current_user;

		$my_drafts    = self::get_users_drafts( $current_user->ID );
		$my_scheduled = self::get_users_future( $current_user->ID );
		$pending      = self::get_others_pending();

		$results = array(
			array(
				__('Your Drafts:', 'draftsforfriends'),
				count( $my_drafts ),
				$my_drafts,
			),
			array(
				__('Your Scheduled Posts:', 'draftsforfriends'),
				count( $my_scheduled ),
				$my_scheduled,
			),
			array(
				__('Pending Review:', 'draftsforfriends'),
				count( $pending ),
				$pending,
			),
		);

		wp_send_json( $results );
	}

	private static function get_others_pending() {
		return get_posts( array(
			'post_status' => array( 'draft', 'pending' ),
		) );
	}

	private static function get_users_drafts( $user_id ) {
		global $wpdb;

		$query = $wpdb->prepare("SELECT ID, post_title FROM $wpdb->posts WHERE post_type = 'post' AND post_status = 'draft' AND post_author = %d ORDER BY post_modified DESC", $user_id);

		$query = apply_filters( 'get_users_drafts', $query );
		return $wpdb->get_results( $query );
	}
	
	private static function get_users_future( $user_id ) {
		global $wpdb;
		return $wpdb->get_results("SELECT ID, post_title FROM $wpdb->posts WHERE post_type = 'post' AND post_status = 'future' AND post_author = $user_id ORDER BY post_modified DESC");
	}

	/**
	 * Function returning shared drafts
	 * @return array of drafts
	 */
	public static function get_shared_drafts() {
		check_ajax_referer( 'my_nonce', 'nonce' );

		$posts = array();
		$shared_data = array();
		$return = array();

		$posts = get_posts( array(
			'posts_per_page'   => -1,
			'post_type'        => 'post',
			'post_status'      => array( 'draft', 'pending', 'future' )
		) );

		foreach ( $posts as $post ) {
			$transient_name = 'mytransient_' . $post->ID;
			$shared_key = get_transient( $transient_name );

			if ( $shared_key ) {
				$url         = get_bloginfo( 'url' ) . '/?p=' . $post->ID . '&draftsforfriends='. $shared_key;
				$expiration  = get_option( '_transient_timeout_' . $transient_name );
				$shared_data = array(
					'key'       => $shared_key,
					// because javascript...
					'expires'   => $expiration * 1000,
					'url'       => $url
				);
				$return[]    = array(
					'shared'    => $shared_data,
					'post'      => $post
				);
			}
		}

		wp_send_json($return);
	}

	/**
	 * Function sharing a draft
	 * @return array with shared draft data
	 */
	public static function start_sharing_draft() {
		check_ajax_referer( 'my_nonce', 'nonce' );

		if ( isset( $_POST['post_id'] ) ) {
			$post_id = intval( $_POST['post_id'] );
			$expire_time = intval( sanitize_text_field( $_POST['expire_time'] ) );
			$expire_unit = $_POST['expire_unit'];
			$post = get_post( $post_id );

			if ( ! $post ) {
				 die( __( 'There is no such post!', 'draftsforfriends' ) );
			}
			if ( 'publish' == get_post_status( $post ) ) {
				die ( __( 'The post is published!', 'draftsforfriends' ) );
			}

			$transient = 'mytransient_' . $post_id;
			$expiration = self::calc( array('expires' => $expire_time, 'measure' => $expire_unit ) );
			$key = 'baba_' . wp_generate_password( 8, false );

			set_transient( $transient, $key, $expiration );

			$url         = get_bloginfo( 'url' ) . '/?p=' . $post->ID . '&draftsforfriends='. $key;
			$shared_data = array(
				'key'       => $key,
				// because javascript...
				'expires'   => ( time() + $expiration ) * 1000,
				'url'       => $url
			);
			$return[]   = array(
				'shared'    => $shared_data,
				'post'      => $post
			);

			wp_send_json($return);
		}

		die ( __( 'Bad request format! ', 'draftsforfriends' ) );
	}

	/**
	 * Function extending draft sharing
	 * @return array with extended expiration and post id
	 */
	public static function extend_sharing_draft() {
		check_ajax_referer( 'my_nonce', 'nonce' );

		if ( isset( $_POST['post_id'] ) ) {
			$post_id = intval( $_POST['post_id'] );
			$expire_time = intval( sanitize_text_field( $_POST['expire_time'] ) );
			$expire_unit = $_POST['expire_unit'];
			$post = get_post( $post_id );

			if ( ! $post ) {
				 die( __( 'There is no such post!', 'draftsforfriends' ) );
			}
			if ( 'publish' == get_post_status( $post ) ) {
				die ( __( 'The post is published!', 'draftsforfriends' ) );
			}

			$transient_name = 'mytransient_' . $post_id;
			$transient = get_transient( $transient_name );

			if ( $transient ) {
				$current_time             = current_time( 'timestamp', 0 );
				$current_expiration_time  = intval( get_option( '_transient_timeout_' . $transient_name ) );
				$new_expiration_value     = self::calc( array('expires' => $expire_time, 'measure' => $expire_unit ) );
				$current_expiration_value = $current_expiration_time - $current_time;
				$expiration               = $current_expiration_value + $new_expiration_value;

				set_transient( $transient_name, $transient, $expiration );

				$return = array(
					'share_expiration' => ( time() + $expiration ) * 1000,
					'post_id'          => $post_id,
				);

				wp_send_json($return);
			}

			die ( __( 'Post no longer shared!', 'draftsforfriends' ) );
		}
		die ( __( 'Bad request format! ', 'draftsforfriends' ) );
	}

	/**
	 * Function disabling sharing for a draft
	 * @return array with result of action and post id
	 */
	public static function stop_sharing_draft() {
		check_ajax_referer( 'my_nonce', 'nonce' );

		if ( isset( $_REQUEST['post_id'] ) ) {
			$post_id = intval( $_REQUEST['post_id'] );
			$result = delete_transient( 'mytransient_' . $post_id);

			wp_send_json( array(
				'post_id' => $post_id,
				'result' => $result,
			) );
		}

		die ( __( 'Bad request format! ', 'draftsforfriends' ) );
	}
}

new Drafts_For_Friends_Admin_Ajax();
