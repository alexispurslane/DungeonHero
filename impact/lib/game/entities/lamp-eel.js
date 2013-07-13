ig.module(
    'game.entities.lamp-eel'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLampEel = ig.Entity.extend({
	
	size: {x: 32, y: 32},
	delay: 1,
	delayTimer: null,
	triggerEntity: null,
	
	
	init: function( x, y, settings ) {
		this.parent(x, y, settings);
		this.animSheet = new ig.AnimationSheet('media/tilesetd.png', 32, 32);
		
		// Add the animations
		this.addAnim('idle', 1, [229]);
        if (!ig.global.wm && ig.game.lightManager) {
            this.light = ig.game.lightManager.addLight(this, {
                angle: 5,
                angleSpread: 380,
                radius: 60,
                color: 'rgba(0,155,255,0.1)', // there is an extra shadowColor option
                useGradients: true, // false will use color/ shadowColor
                shadowGradientStart: 'rgba(0,0,0,0.1)', // 2-stop radial gradient at 0.0 and 1.0
                shadowGradientStop: 'rgba(0,0,0,0.1)',
                lightGradientStart: 'rgba(0,200,255,0)', // 2-stop radial gradient at 0.0 and 1.0
                lightGradientStop: 'rgba(0,0,0,0.6)',
                pulseFactor: 1,
                lightOffset: {
                    x: 0,
                    y: 0
                } // lightsource offset from the middle of the entity
            });
        }
	},
	update: function(){
	}
});

});