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
			add_action( 'init', array( &$this, 'init' ) );
	}

	public function init() {
		global $current_user;

		define('ASSETS_PATH',  plugins_url( '/', __FILE__ ) );

		add_action( 'admin_menu', array( $this, 'add_admin_pages' ) );
		add_filter( 'the_posts', array( $this, 'the_posts_intercept' ) );
		add_filter( 'posts_results', array( $this, 'posts_results_intercept' ));

		$this->admin_options = $this->get_admin_options();
		$this->user_options = ( $current_user->ID > 0 && isset( $this->admin_options[ $current_user->ID ] ) ) ?
			$this->admin_options[ $current_user->ID ] : array();
		$this->save_admin_options();
		$this->admin_page_init();
	}

	public function admin_page_init() {
		wp_enqueue_script( 'jquery' );
		add_action('admin_head', array($this, 'enqueue_scripts'));
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'bundle', ASSETS_PATH . 'build/bundle.js', array() );
		wp_enqueue_script( 'jquery-handle-table', ASSETS_PATH . 'build/handle_table.js', array() );
	}

	private function get_admin_options() {
		$saved_options = get_option( 'shared' );
		return is_array( $saved_options ) ? $saved_options : array();
	}

	private function save_admin_options(){
		global $current_user;
		if ( $current_user->ID > 0 ) {
				$this->admin_options[ $current_user->ID ] = $this->user_options;
		}
		update_option( 'shared', $this->admin_options );
	}

	public function add_admin_pages(){
		add_submenu_page( 'edit.php', __('Drafts for Friends', 'draftsforfriends'), __('Drafts for Friends', 'draftsforfriends'),
			'publish_posts', __FILE__, array( $this, 'output_existing_menu_sub_admin_page' ) );
	}

	private function calc( $params ) {
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

	private function process_post_options( $params ) {
		global $current_user;
		if ( $params['post_id'] ) {
			$post = get_post( $params['post_id'] );
			if ( ! $post ) {
				return __('There is no such post!', 'draftsforfriends');
			}
			if ( 'publish' == get_post_status( $post ) ) {
				return __('The post is published!', 'draftsforfriends');
			}
			$this->user_options['shared'][] = array(
				'id'      => $post->ID,
				'expires' => time() + $this->calc( $params ),
				'key'     => 'baba_' . wp_generate_password( 8, false )
			);
			$this->save_admin_options();
		}	
	}

	private function process_delete( $params ) {
		$shared = array();

		foreach ( $this->user_options['shared'] as $share ) {
			if ( $share['key'] == $params['key'] ) {
				continue;
			}
			$shared[] = $share;
		}
		$this->user_options['shared'] = $shared;
		$this->save_admin_options();
	}

	private function process_extend( $params ) {
		$shared = array();

		foreach( $this->user_options['shared'] as $share ) {
			if ( $share['key'] == $params['key'] ) {
				$share['expires'] += $this->calc( $params );
			}
			$shared[] = $share;
		}
		$this->user_options['shared'] = $shared;
		$this->save_admin_options();
	}

	private function get_drafts() {
		global $current_user;
		$my_drafts    = $this->get_users_drafts( $current_user->ID );
		$my_scheduled = $this->get_users_future( $current_user->ID );
		$pending      = $this->get_others_pending();
		$drafts = array(
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
		return $drafts;
	}

	private function get_others_pending() {
		return get_posts( array(
			'post_status' => array( 'draft', 'pending' ),
		) );
	}

	private function get_users_drafts( $user_id ) {
		global $wpdb;

		$query = $wpdb->prepare("SELECT ID, post_title FROM $wpdb->posts WHERE post_type = 'post' AND post_status = 'draft' AND post_author = %d ORDER BY post_modified DESC", $user_id);

		$query = apply_filters( 'get_users_drafts', $query );
		return $wpdb->get_results( $query );
	}
	
	private function get_users_future( $user_id ) {
		global $wpdb;
		return $wpdb->get_results("SELECT ID, post_title FROM $wpdb->posts WHERE post_type = 'post' AND post_status = 'future' AND post_author = $user_id ORDER BY post_modified DESC");
	}

	private function get_shared() {
		if ( isset( $this->user_options['shared'] ) ) {
			return $this->user_options['shared'];
		}

		return array();
	}

	public function output_existing_menu_sub_admin_page(){
		$result = array();

		if ( isset ( $_POST['draftsforfriends_submit'] ) ) {
			$result = $this->process_post_options( $_POST );
		} elseif( isset( $_POST['action'] ) && 'extend' == $_POST['action'] ){
			$result = $this->process_extend( $_POST );
		} elseif( isset( $_GET['action'] ) && 'delete' == $_GET['action'] ) {
			$result = $this->process_delete( $_GET );
		}
		$drafts = $this->get_drafts();
?>
	<div class="wrap">
		<h2><?php _e('Drafts for Friends', 'draftsforfriends'); ?></h2>
		<?php if ( $result ) : ?>
			<div id="message" class="updated fade"><?php echo $result; ?></div>
		<?php endif; ?>
		<h3><?php _e('Currently shared drafts', 'draftsforfriends'); ?></h3>

		<?php $this->render_drafts_table(); ?>

		<h3><?php _e('Share Drafts', 'draftsforfriends'); ?></h3>
		<form id="draftsforfriends-share" action="" method="post">
			<p>
				<select id="draftsforfriends-postid" 	name="post_id">
				<option value=""><?php _e('Choose a draft', 'draftsforfriends'); ?></option>
					<?php foreach ( $drafts as $draft ): ?>
						<?php if ( $draft[1] ): ?>
							<option value="" disabled="disabled"></option>
							<option value="" disabled="disabled"><?php echo $draft[0]; ?></option>
							<?php foreach( $draft[2] as $draft_post ) : ?>
								<?php if ( empty( $draft_post->post_title ) ) continue; ?>
									<option value="<?php echo $draft_post->ID?>"><?php echo esc_html(  $draft_post->post_title ); ?></option>
							<?php endforeach; ?>
						<?php endif; ?>
					<?php endforeach; ?>
				</select>
			</p>
			<p>
				<input
					type="submit"
					class="button"
					name="draftsforfriends_submit"
					value="<?php _e('Share it', 'draftsforfriends'); ?>"
				/>
				<?php _e('for', 'draftsforfriends'); ?>
				<?php $this->tmpl_measure_select(); ?>.
			</p>
		</form>
	</div>

<?php
	}

	public static function mount_react() { ?>
		<div id="react-mount"></div>
<?php
	}

	private function render_drafts_table() {
		$shared = $this->get_shared();
?>
		<?php $this->mount_react(); ?>
<?php
	}

	private function can_view( $post_id ) {
		foreach ( $this->admin_options as $option ) {
			$shares = $option['shared'];

			foreach ( $shares as $share) {
				if ( $share[ 'key'] == $_GET['draftsforfriends'] && $post_id ) {
					return true;
				}
			}
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

	private function tmpl_measure_select() {
		$secs  = __('seconds', 'draftsforfriends');
		$mins  = __('minutes', 'draftsforfriends');
		$hours = __('hours', 'draftsforfriends');
		$days  = __('days', 'draftsforfriends');

?>
		<input name="expires" type="text" value="2" size="4"/>
		<select name="measure">
			<option value="s"><?php echo $secs ?></option>
			<option value="m"><?php echo $mins ?></option>
			<option value="h" selected="selected"><?php echo $hours ?></option>
			<option value="d"><?php echo $days ?></option>
		</select>
<?php
	}
}

new Drafts_For_Friends();
