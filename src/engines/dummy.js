
var Dummy = function() {

    return {

        // provides some engine info
        info : { 
            name : 'Dummy Game Engine',
            allowed_players : {min:2, max:4}
        },

        // this method will be called just before game starts
        init : function(data) { },

        // this method will be called when the player sends a command  
        // return any interesting data
        command : function(player, data) { 
            return {
                is_valid: true,
                data : 'gamestatus'
            }; 
        },

        // this method should provide all necessary data to present
        // the game to the player
        get_status : function() { return {foo: 'dummy_gamestatus'} }
    }
};

module.exports = Dummy;