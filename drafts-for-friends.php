<?php
/*
Plugin Name: DraftsForFriends
Plugin URI: http://github.com/siemiatj
Description: Now you don't need to add friends as users to the blog in order to let them preview your drafts. Modified from Drafts for Friends originally by Neville Longbottom.
Version: 0.0.1
Author: Kuba 'sasklacz' Siemiatkowski
Author URI: http://saskla.cz
Text Domain: draftsforfriends
*/

class Drafts_For_Friends	{

	public function __construct(){
		$this->create_constants();
		$this->include_files();
		$this->admin_page_init();

		add_action( 'init', array( &$this, 'init' ) );
	}

	private function include_files() {
		include_once( INCLUDES_PATH . 'admin-ajax.php' );
	}

	private function create_constants() {
		define('ASSETS_PATH',  plugins_url( '/', __FILE__ ) );
		define('INCLUDES_PATH', WP_PLUGIN_DIR . '/' . plugin_basename( dirname(__FILE__) ) . '/' );
	}

	public function init() {
		add_filter( 'the_posts', array( $this, 'the_posts_intercept' ) );
		add_filter( 'posts_results', array( $this, 'posts_results_intercept' ) );
	}

	public function admin_page_init() {
		add_action( 'admin_menu', array( $this, 'add_admin_pages' ) );
		add_action( 'admin_head', array($this, 'enqueue_scripts' ) );
	}

	private function get_js_translations(){
		return array(
			'share_form-shareit'      => __( 'Share it for', 'draftsforfriends' ),
			'share_form-chooseadraft' => __( 'Choose a draft', 'draftsforfriends' ),
			'extend_form-extendfor'   => __( 'Extend for', 'draftsforfriends' ),
			'shared_grid-nodrafts'    => __( 'No shared drafts !', 'draftsforfriends' ),
			'shared_grid-extend'      => __( 'Extend', 'draftsforfriends' ),
			'shared_grid-stopsharing' => __( 'Stop sharing', 'draftsforfriends' ),
			'shared_grid-cancel'      => __( 'Cancel', 'draftsforfriends' ),
			'shared_grid-title'       => __( 'Title', 'draftsforfriends' ),
			'shared_grid-link'        => __( 'Link', 'draftsforfriends' ),
			'shared_grid-expires'     => __( 'Expires', 'draftsforfriends' ),
			'shared_grid-actions'     => __( 'Actions', 'draftsforfriends' ),
			'share_time_fields-s'     => __( 'seconds', 'draftsforfriends' ),
			'share_time_fields-m'     => __( 'minutes', 'draftsforfriends' ),
			'share_time_fields-h'     => __( 'hours', 'draftsforfriends '),
			'share_time_fields-d'     => __( 'days', 'draftsforfriends' ),
			'app-currentlyshared'     => __( 'Currently shared drafts', 'draftsforfriends' ),
			'app-sharedrafts'         => __( 'Share Drafts', 'draftsforfriends' )
		);
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'jquery-handle-table', ASSETS_PATH . 'build/handle_table.js', array() );
		wp_localize_script( 'jquery-handle-table',
			'APP_DATA',
			array(
				'nonce' => wp_create_nonce( 'my_nonce' ),
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'translations' => $this->get_js_translations()
			)
		);
		wp_enqueue_script( 'bundle', ASSETS_PATH . 'build/bundle.js', array() );
	}

	public function add_admin_pages(){
		add_submenu_page( 'edit.php', __( 'Drafts for Friends', 'draftsforfriends' ), __( 'Drafts for Friends', 'draftsforfriends' ),
			'publish_posts', __FILE__, array( $this, 'render_sub_menu_page' ) );
	}

	public function render_sub_menu_page(){
?>
		<div id="react-mount"></div>
<?php
	}

	private function can_view( $post_id ) {
		$transient_name = 'mytransient_' . $post_id;
		$shared_key = get_transient( $transient_name );
		if ( $post_id && $shared_key == $_GET['draftsforfriends'] ) {
			return true;
		}

		return false;
	}

	public function posts_results_intercept( $posts ) {
		if ( 1 != count( $posts ) ) {
			return $posts;
		}

		$post = $posts[0];
		$status = get_post_status( $post );
		if ( 'publish' != $status && $this->can_view( $post->ID ) ) {
			$this->shared_post = $post;
		}
		return $posts;
	}

	public function the_posts_intercept( $posts ){
		if ( empty( $posts ) && ( ! empty( $this->shared_post ) ) && ! is_null( $this->shared_post ) ) {
			return array( $this->shared_post );
		}

		$this->shared_post = null;
		return $posts;
	}
}

new Drafts_For_Friends();
