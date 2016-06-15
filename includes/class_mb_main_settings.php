<?php

if (!class_exists('main_settings')) { 
    class main_settings {
        /**
         * Holds the values to be used in the fields callbacks
         */
        private $options;

        /**
         * Start up
         */
        public function __construct() {
            add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
            add_action( 'admin_init', array( $this, 'page_init' ) );
        }

        /**
         * Add options page
         */
        public function add_plugin_page() {
            // This page will be under "Settings"
            add_options_page(
                'Settings Admin', 
                'Fotaf Settings', 
                'manage_options', 
                'fotaf_global_setting', 
                array( $this, 'create_admin_page' )
            );
        }

        /**
         * Options page callback
         */
        public function create_admin_page() {
            // Set class property
            $this->options = get_option( 'option_name' );
            ?>
            <div class="wrap">
                <h2>Fotaf Settings</h2>           
                <form method="post" action="options.php">
                <?php
                    // This prints out all hidden setting fields
                    settings_fields( 'my_option_group' );   
                    do_settings_sections( 'paypal_setting_admin' );
                    submit_button(); 
                ?>
                </form>
            </div>
            <?php
        }

        /*
         * Register and add settings
         */
        public function page_init() {        
            
            register_setting(
                'my_option_group', // Option group
                'option_name', // Option name
                array( $this, 'sanitize' ) // Sanitize
            );

            add_settings_section(
                'setting_section_id', // ID
                'My Custom Settings', // Title
                array( $this, 'print_section_info' ), // Callback
                'paypal_setting_admin' // Page
            );  

            add_settings_field(
                'PPL_API_USER', // ID
                'PPL_API_USER', // Title 
                array( $this, 'PPL_API_USER_CALLBACK' ), // Callback
                'paypal_setting_admin', // Page
                'setting_section_id' // Section           
            );      

            add_settings_field(
                'PPL_API_PASSWORD', 
                'PPL_API_PASSWORD', 
                array( $this, 'PPL_API_PASSWORD_CALLBACK' ), 
                'paypal_setting_admin', 
                'setting_section_id'
            );
            
              add_settings_field(
                'PPL_API_SIGNATURE', 
                'PPL_API_SIGNATURE', 
                array( $this, 'PPL_API_SIGNATURE_CALLBACK' ), 
                'paypal_setting_admin', 
                'setting_section_id'
            ); 

            add_settings_field(
                'PPL_RETURN_URL', 
                'PPL_RETURN_URL', 
                array( $this, 'PPL_RETURN_URL_CALLBACK' ), 
                'paypal_setting_admin', 
                'setting_section_id'
            );

            add_settings_field(
                'PPL_CANCEL_URL', 
                'PPL_CANCEL_URL', 
                array( $this, 'PPL_CANCEL_URL_CALLBACK' ), 
                'paypal_setting_admin', 
                'setting_section_id'
            ); 

            add_settings_field(
                'PPL_CURRENCY_CODE', 
                'PPL_CURRENCY_CODE', 
                array( $this, 'PPL_CURRENCY_CODE' ), 
                'paypal_setting_admin', 
                'setting_section_id'
            );     

             add_settings_field(
                'log', // ID
                array( $this, 'log_callback' ), // Callback
                'paypal_setting_admin', // Page
                'setting_section_id' // Section           
            );

            add_settings_field(
                'save', // ID
                array( $this, 'save_callback' ), // Callback
                'paypal_setting_admin', // Page
                'setting_section_id' // Section           
            );           
        }

        /**
         * Sanitize each setting field as needed
         *
         * @param array $input Contains all settings fields as array keys
         */
        public function sanitize( $input ){
            $new_input = array();
            if( isset( $input['PPL_API_USER'] ) )
                $new_input['PPL_API_USER'] = sanitize_text_field( $input['PPL_API_USER'] );

            if( isset( $input['PPL_API_PASSWORD'] ) )
                $new_input['PPL_API_PASSWORD'] = sanitize_text_field( $input['PPL_API_PASSWORD'] );
        
            if( isset( $input['PPL_API_SIGNATURE'] ) )
                $new_input['PPL_API_SIGNATURE'] = sanitize_text_field( $input['PPL_API_SIGNATURE'] );
            
            if( isset( $input['PPL_RETURN_URL'] ) )
                $new_input['PPL_RETURN_URL'] = sanitize_text_field( $input['PPL_RETURN_URL'] );
            
            if( isset( $input['PPL_CANCEL_URL'] ) )
                $new_input['PPL_CANCEL_URL'] = sanitize_text_field( $input['PPL_CANCEL_URL'] );
            
            if( isset( $input['PPL_CURRENCY_CODE'] ) )
                $new_input['PPL_CURRENCY_CODE'] = sanitize_text_field( $input['PPL_CURRENCY_CODE'] );
                        

            if( isset( $input['log'] ) )
                $new_input['log'] = filter_var($input['log'], FILTER_SANITIZE_NUMBER_INT);
            if( isset( $input['save'] ) )
                $new_input['save'] = filter_var($input['save'], FILTER_SANITIZE_NUMBER_INT);

           
            return $new_input;
        }

        /** 
         * Print the Section text
         */
        public function print_section_info() {
            print 'Enter your settings below:';
        }
 
        /** 
         * Get the settings option array and print one of its values
         */
        public function PPL_API_USER_CALLBACK() {
            printf(
                '<input type="text" id="PPL_API_USER" width="250" name="option_name[PPL_API_USER]" value="%s" />',
                isset( $this->options['PPL_API_USER'] ) ? esc_attr( $this->options['PPL_API_USER']) : ''
            );
        }
    
     
        public function PPL_API_PASSWORD_CALLBACK(){
            printf(
                '<input type="text" id="PPL_API_PASSWORD" name="option_name[PPL_API_PASSWORD]" value="%s" />',
                isset( $this->options['PPL_API_PASSWORD'] ) ? esc_attr( $this->options['PPL_API_PASSWORD']) : ''
            );
        }

        public function PPL_API_SIGNATURE_CALLBACK(){
            printf(
                '<input type="text" id="PPL_API_SIGNATURE" name="option_name[PPL_API_SIGNATURE]" value="%s" />',
                isset( $this->options['PPL_API_SIGNATURE'] ) ? esc_attr( $this->options['PPL_API_SIGNATURE']) : ''
            );
        }

        public function PPL_RETURN_URL_CALLBACK(){
            printf(
                '<input type="text" id="PPL_RETURN_URL" name="option_name[PPL_RETURN_URL]" value="%s" />',
                isset( $this->options['PPL_RETURN_URL'] ) ? esc_attr( $this->options['PPL_RETURN_URL']) : ''
            );
        }

        public function PPL_CANCEL_URL_CALLBACK(){
            printf(
                '<input type="text" id="PPL_CANCEL_URL" name="option_name[PPL_CANCEL_URL]" value="%s" />',
                isset( $this->options['PPL_CANCEL_URL'] ) ? esc_attr( $this->options['PPL_CANCEL_URL']) : ''
            );
        }

        public function PPL_CURRENCY_CODE_CALLBACK(){
            printf(
                '<input type="text" id="PPL_CURRENCY_CODE" name="option_name[PPL_CURRENCY_CODE]" value="%s" />',
                isset( $this->options['PPL_CURRENCY_CODE'] ) ? esc_attr( $this->options['PPL_CURRENCY_CODE']) : ''
            );
        }

         public function log_callback () {
            printf(
                '  <input type="checkbox" id="log" name="option_name[log]" %s>',
                isset( $this->options['log'] ) ? 'checked' : ''
            );
        }
        public function save_callback () {
            printf(
                '  <input type="checkbox" id="save" name="option_name[save]" %s>',
                isset( $this->options['save'] ) ? 'checked' : ''
            );
        }
    }
}
if( is_admin() ) {
    $my_settings_page = new main_settings();
}
