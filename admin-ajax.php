<?php

/**
 * Admin Ajax page
 * handles sharing/unsharing drafts via XHR requests
 */
class Drafts_For_Friends_Admin_Ajax {
	public function __construct() {
		add_action( 'wp_ajax_start_sharing_draft', array(__CLASS__, 'start_sharing_draft' ) );
		add_action( 'wp_ajax_stop_sharing_draft', array(__CLASS__, 'stop_sharing_draft' ) );
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
