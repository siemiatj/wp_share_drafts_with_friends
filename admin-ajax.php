<?php

/**
 * Admin Ajax page
 * handles sharing/unsharing drafts via XHR requests
 */
class Drafts_For_Friends_Admin_Ajax {
	public function __construct() {
		add_action( 'wp_ajax_start_sharing_draft', array(__CLASS__, 'start_sharing_draft' ) );
		add_action( 'wp_ajax_stop_sharing_draft', array(__CLASS__, 'stop_sharing_draft' ) );
		add_action( 'wp_ajax_get_shared_drafts', array(__CLASS__, 'get_shared_drafts' ) );
	}

	public static function get_shared_drafts() {
		wp_verify_nonce( $_REQUEST['nonce'], 'my-nonce' );
		$shared = array();
		$results = array();

		// if ( isset( $this->user_options['shared'] ) ) {
		// 	$shared = $this->user_options['shared'];
		// }

		if ( ! empty( $shared ) ) {
			foreach ( $shared as $single ) {
				$url         = get_bloginfo( 'url' ) . '/?p=' . $single->id . '&draftsforfriends='. $single['key'];
				$shared_data = array(
					'key'       => $single['key'],
					'expires'   => $single['expires'],
					'url'       => $url
				);
				$post        = get_post( $single['id'] );
				$results[]   = array(
					'shared'    => $shared_data,
					'post'      => $post
				);
			}
		}

		echo json_encode( array( 'data' => $results ) );

		die();
	}

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
