Sow.registerNamespace(/**[settings]*/'Sow.Net.Web.default', function () {
	return /**[modules]*/[{
		//[Extend VIEW]
		100: [function ( require, module, exports ) {

			return module.aggregate( function () {
				return {
					onExecuteIo: function ( a, b, c ) {
						if ( typeof ( this[c] ) === 'function' )
							this[c]( a, b );
					},
				};
			} );

		}, {
			isExtend: true,
			ext_key: 5
		}],
		//[/Extend VIEW]
		101: [function ( require, module, exports ) {

			return module.aggregate( function () {
				return {
					ready: function ( a ) {
						console.log( a );
						require( 'Sow.Net.Web.Data' ).a( "I'm Ready..." );
					}
				};
			} );

		}, {
			'Sow.Net.Web.Controller': 3,
			'Sow.Net.Web.Data': 4,
			'Sow.Net.Web.View': 5
		}]
	}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
} ).registerNamespace(/**[settings]*/'Sow.Net.Web.Auth.Login', function () {
	return /**[modules]*/[{
		//[Extend VIEW]
		100: [function ( require, module, exports ) {

			return module.aggregate( function () {
				return {
					onExecuteIo: function ( a, b, c ) {
						if ( typeof ( this[c] ) === 'function' )
							this[c]( a, b );
					},
				};
			} );

		}, {
			isExtend: true,
			ext_key: 5
		}],
		//[/Extend VIEW]
		101: [function ( require, module, exports ) {

			return module.aggregate( function () {
				return {
					ready: function ( a ) {
						console.log( a );
						require( 'Sow.Net.Web.Data' ).a( "I'm Ready..." );
					}
				};
			} );

		}, {
			'Sow.Net.Web.Controller': 3,
			'Sow.Net.Web.Data': 4,
			'Sow.Net.Web.View': 5
		}]
	}, {/**[cache]*/ }, /**[entry]*/[100, 101]]
} ).mapPageNamespace( );