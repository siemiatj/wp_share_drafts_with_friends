<?php

/**
 * Admin Ajax page
 * handles sharing/unsharing drafts via XHR requests
 */
class Drafts_For_Friends_Admin_Ajax {
	public function __construct() {
		add_action( 'wp_ajax_start_sharing_draft', array(__CLASS__, 'start_sharing_draft' ) );
		add_action( 'wp_ajax_stop_sharing_draft', array(__CLASS__, 'stop_sharing_draft' ) );
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

	public static function get_drafts() {
		// $nonce = $_REQUEST['nonce'];

		// check_ajax_referer( 'my-nonce' );

		// wp_verify_nonce( $_REQUEST['nonce'], 'my-nonce' );
		// if (empty($_GET) || !wp_verify_nonce( $nonce, 'my-nonce' ) ) die( 'Security check' );

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

	public static function get_shared_drafts() {
		// wp_verify_nonce( $_REQUEST['nonce'], 'my-nonce' );
		$posts = array();
		$shared_data = array();
		$return = array();

		// if ( ! empty( $shared ) ) {
		// 	foreach ( $shared as $single ) {
		// 		$url         = get_bloginfo( 'url' ) . '/?p=' . $single->id . '&draftsforfriends='. $single['key'];
		// 		$shared_data = array(
		// 			'key'       => $single['key'],
		// 			'expires'   => $single['expires'],
		// 			'url'       => $url
		// 		);
		// 		$post        = get_post( $single['id'] );
		// 		$results[]   = array(
		// 			'shared'    => $shared_data,
		// 			'post'      => $post
		// 		);
		// 	}
		// }

		// $post_types = get_post_types( '', 'names' );

		$posts = get_posts( array(
			// 'posts_per_page'   => -1,
			// 'orderby'          => 'title',
			// 'order'            => 'ASC',
			'post_type'        => 'post',
			'post_status'      => array( 'draft', 'pending', 'future' )
		) );

		foreach ( $posts as $post ) {
			$transient_name = 'mytransient_' . $post->ID;
			$shared_key = get_transient( $transient_name );
			$return = array();

			if ( $shared_key ) {
				$url         = get_bloginfo( 'url' ) . '/?p=' . $post->ID . '&draftsforfriends='. $shared_key;
				$expiration  = get_option( '_transient_timeout_' . $transient_name );
				$shared_data = array(
					'key'       => $shared_key,
					'expires'   => $single['expires'],
					'url'       => $url
				);
				$post        = get_post( $single['id'] );
				$return[]   = array(
					'shared'    => $shared_data,
					'post'      => $post
				);
			}
		}

		wp_send_json($return);
	}

	// private function process_delete( $params ) {
	// 	$shared = array();

	// 	foreach ( $this->user_options['shared'] as $share ) {
	// 		if ( $share['key'] == $params['key'] ) {
	// 			continue;
	// 		}
	// 		$shared[] = $share;
	// 	}
	// 	$this->user_options['shared'] = $shared;
	// 	$this->save_admin_options();
	// }

	// private function process_extend( $params ) {
	// 	$shared = array();

	// 	foreach( $this->user_options['shared'] as $share ) {
	// 		if ( $share['key'] == $params['key'] ) {
	// 			$share['expires'] += $this->calc( $params );
	// 		}
	// 		$shared[] = $share;
	// 	}
	// 	$this->user_options['shared'] = $shared;
	// 	$this->save_admin_options();
	// }

	// private function process_post_options( $params ) {
	// 	global $current_user;
	// 	if ( $params['post_id'] ) {
	// 		$post = get_post( $params['post_id'] );
	// 		if ( ! $post ) {
	// 			return __('There is no such post!', 'draftsforfriends');
	// 		}
	// 		if ( 'publish' == get_post_status( $post ) ) {
	// 			return __('The post is published!', 'draftsforfriends');
	// 		}
	// 		$this->user_options['shared'][] = array(
	// 			'id'      => $post->ID,
	// 			'expires' => time() + $this->calc( $params ),
	// 			'key'     => 'baba_' . wp_generate_password( 8, false )
	// 		);
	// 		$this->save_admin_options();
	// 	}	
	// }

	public static function start_sharing_draft() {
		wp_verify_nonce( $_REQUEST['nonce'], 'my-nonce' );
		$response = array('response' => 'start' );
		echo json_encode( $response );
		die();
	}

	public static function stop_sharing_draft() {
		wp_verify_nonce( $_REQUEST['nonce'], 'my-nonce' );
		$response = array('response' => 'stop' );
		echo json_encode( $response );
		die();
	}
}

new Drafts_For_Friends_Admin_Ajax();
