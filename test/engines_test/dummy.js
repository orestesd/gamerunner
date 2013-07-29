
var Dummy = function() {

    return {
        info : { 
            name : 'Dummy Game Engine',
            allowed_players : {min:2, max:4}
        },

        init : function(data) { },

        command : function(player, data) { 
            return {
                is_valid: true,
                data : 'gamestatus'
            }; 
        },

        get_status : function() { return {foo: 'dummy_gamestatus'} }
    }
};

module.exports = Dummy;