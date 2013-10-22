var ColorsShapes = function() {

    var game = {bag : new Array(),
                players: new Array(),
                boardTokens: new Array()};

    /*game.bag = require('_colorsShapes/bag.js');
    game.game = require('_colorsShapes/game.js');
    game.token = require('_colorsShapes/token.js');*/
		
    return {
        info : {             
        	name : 'Colors & Shapes Game Engine', 
            allowed_players : {min:2, max:4}
        },
        init : function(data) { 

            console.log("Init game Colors & Shapes");

            game.bag = initBag();
            game.boardTokens = new Array();

            return true;
        },

        command : function(game_id, data) {
            console.log("Colors & Shapes command, game_id "+game_id);

            try{
                var playerTokensClient = data.playerTokens;
                var playerTokensServer;

                for (var i = game.players.length - 1; i >= 0; i--) {
                    if(parseInt(game.players[i].id) == parseInt(data.playerid))
                        playerTokensServer = game.players[i].tokens;
                }

                if(!checkPlayerTokens(playerTokensClient, playerTokensServer)){                
                    console.log("There is an error in player token validation.");
                    return {is_valid: false, timestamp : 999};
                } else if(!checkMove(game.boardTokens, playerTokensClient)){
                    console.log("There is an error in board token validation.");
                    return {is_valid: false, timestamp : 999};
                }else if(!isJoined(game.boardTokens, playerTokensClient)){
                    console.log("There is an error in join token validation.");
                    return {is_valid: false, timestamp : 999};
                }else{     
                    console.log("Command validation correct");

                    playerTokens = playerTokensRegister(game, playerTokensClient);

                    var statusData = {
                        gameid : game_id,
                        //players : [{id:1, name:"player1"},{id:2, name:"player2"}],
                        lastUpdate: "",
                        playerTurn: 1,
                        playerTokens: playerTokens,
                        boardTokens: game.boardTokens
                    };

                    return {is_valid: true, timestamp : 999, playerData : statusData };
                }
            }catch(ex){
                console.log("Error command", ex)
            }
            return {is_valid: false, timestamp : 999, playerData : statusData };
        },
        get_status : function(game_id, data) {

            console.log("Geting Colors & Shapes status game_id "+game_id);

            var playerTokens = new Array();            
            for (var i = game.players.length - 1; i >= 0; i--) {
                if(game.players[i].id==data.playerid)
                    playerTokens = game.players[i].tokens;
            };

            playerTokens = playerTokensRegister(game, playerTokens);

        	var statusData = {
        			gameid : game_id,
        			//players : [{id:1, name:"player1"},{id:2, name:"player2"}],
        			lastUpdate: "",
        			playerTurn: 1,
        			playerTokens: playerTokens,
        			boardTokens: game.boardTokens
        		};

        	return {is_valid: true, timestamp : 999, playerData : statusData };
        }

   };

    function getTokenFromBag(bag){
        var tokenRandom=Math.floor(Math.random()*(bag.length-1));           
        var token = bag[tokenRandom];
        bag.splice(tokenRandom, 1); // Drop token from the bag
        console.log('Number of tokens in the bag: ' + bag.length);
        return token;
    };

    function initBag(){
        //Generating game tokens
        var cont = 1;
        var bag = new Array();
        for(var i=1; i<=6; i++){
            for(var colorNumber=1; colorNumber<=6; colorNumber++){
                for(var shapeNumber=1; shapeNumber<=6; shapeNumber++){
                    var token = {   id: cont,
                                    color : colorNumber,
                                    shape : shapeNumber};
                    bag.push(token);
                    cont++;
                }
            }
        }
        return bag;
    };

    function playerTokensRegister(game, playerTokens){

        //Take new tokens from the bag and lend tokens to the board
        try{
            var newPlayerTokens = new Array();
            for (var i=0; i<playerTokens.length; i++) {
                if(playerTokens[i].onBoard == "true"){     
                    var token = {   id: parseInt(playerTokens[i].id),
                                    color: parseInt(playerTokens[i].color),
                                    shape: parseInt(playerTokens[i].shape),
                                    x_position: parseInt(playerTokens[i].x_position),
                                    y_position: parseInt(playerTokens[i].y_position)
                                };
                    game.boardTokens.push(token);
                    newPlayerTokens.push(getTokenFromBag(game.bag));
                }else{
                    var token = {   id: parseInt(playerTokens[i].id),
                                    color: parseInt(playerTokens[i].color),
                                    shape: parseInt(playerTokens[i].shape)
                                    };
                    newPlayerTokens.push(token);
                }
            }

            //Add extra tokens
            for (var i=newPlayerTokens.length; i<6; i++) {
                newPlayerTokens.push(getTokenFromBag(game.bag));
            }

            for (var i = game.players.length - 1; i >= 0; i--) {
                if(parseInt(game.players[i].id) == parseInt(data.playerid))
                    game.players[i].tokens=newPlayerTokens;
            }

            return newPlayerTokens;
        }catch(ex){
            console.error("Error playerTokensRegister", ex);
        }
    }   

    function checkPlayerTokens(playerTokensClient, playerTokensServer){

        console.log("Check player tokens");

        try{
            //Check if the player tokens are theme same in the server
            for (var serverToken = playerTokensServer.length - 1; serverToken >= 0; serverToken--) {
                var existToken = false;
                for (var clientToken = playerTokensClient.length - 1; clientToken >= 0; clientToken--) {
                    console.log("Server token: "+playerTokensServer[serverToken].id+" - Client token: " + playerTokensClient[clientToken].id);
                    if( parseInt(playerTokensClient[clientToken].id) == parseInt(playerTokensServer[serverToken].id) ||
                        parseInt(playerTokensClient[clientToken].color) == parseInt(playerTokensServer[serverToken].color) ||
                        parseInt(playerTokensClient[clientToken].shape) == parseInt(playerTokensServer[serverToken].shape))
                            existToken = true;
                        console.log("existToken: " + existToken);
                }
                if(!existToken)
                    return false;
            }
        }catch(ex){
            console.error("Error checkPlayerTokens.", ex)
        }
        return true;
    };

    function checkMove(boardTokens, playerTokens){

        console.log("Check move");

        var emptyBox = true;

        try{

            console.log(playerTokens);

            //Checking if there are token on the board
            for (var numToken = playerTokens.length - 1; numToken >= 0; numToken--) {
                var token = playerTokens[numToken];

                if(token.onBoard=="true"){
                    if(boardTokens.length == 0){
                        for (var i = playerTokens.length - 1; i >= 0; i--) {
                            if(playerTokens[i].id !=token.id && playerTokens[i].onBoard=="true")
                                break;
                        }
                        if(i<0)
                            return true;
                    }

                    /*******Horizontal check*******/
                    console.log("Check horizontal move token " + token.id);
                    var horizontalTokens = getHorizontalTokens(boardTokens, playerTokens, token);
                    for(var i=0; i<horizontalTokens.length; i++){
                        for(var e=i+1; e<horizontalTokens.length; e++){
                            if( (horizontalTokens[i].id!=horizontalTokens[e].id) &&
                                ((horizontalTokens[i].color != horizontalTokens[e].color && horizontalTokens[i].shape != horizontalTokens[e].shape) ||
                                (horizontalTokens[i].color == horizontalTokens[e].color && horizontalTokens[i].shape == horizontalTokens[e].shape))){
                                    console.log("Check move: Check horizontal move. token_id"+ token.id);
                                    return false;
                            }
                        }
                    }

                    /*******Vertical check*******/
                    console.log("Check vertical move token " + token.id);
                    var verticalTokens = getVerticalTokens(boardTokens, playerTokens, token);
                    for(var i=0; i<verticalTokens.length; i++){
                        for(var e=i+1; e<verticalTokens.length; e++){
                            if( (verticalTokens[i].id != verticalTokens[e].id) &&
                                ((verticalTokens[i].color != verticalTokens[e].color && verticalTokens[i].shape != verticalTokens[e].shape) ||
                                (verticalTokens[i].color == verticalTokens[e].color && verticalTokens[i].shape == verticalTokens[e].shape))){
                                    console.log("Check move: Check vertical move. token_id"+ token.id);
                                    return false;
                            }
                        }
                    }

                    //Always near other tokens
                    if(verticalTokens.length==1 && horizontalTokens.length==1){
                        console.log("Check move: Always near other tokens error. token_id "+ token.id);
                        return false;
                    }
                }
            };
            return true;
        }catch(ex){
            console.error("Error Check move",ex);
            throw ex;
        }

    }

    function getHorizontalTokens(boardTokens, playerTokens, token){
                      
        try{           

                    var horizontalTokens = new Array();
                    horizontalTokens.push(token);

                    //Next
                    var x = parseInt(token.x_position)+1;
                    var y = parseInt(token.y_position);
                    var empty = false;
                    while(!empty){
                        empty = true;
                        for (var i = boardTokens.length - 1; i >= 0; i--) {
                            if( boardTokens[i].id != token.id && 
                                boardTokens[i].x_position == x && boardTokens[i].y_position==y){
                                    boardTokens[i].playerToken = false;
                                    horizontalTokens.push(boardTokens[i]);
                                    empty = false;
                                    x++;
                            }
                        }

                        for (var i = playerTokens.length - 1; i >= 0; i--) {
                            if( playerTokens[i].id != token.id && playerTokens[i].onBoard=="true" && 
                                playerTokens[i].x_position == x && playerTokens[i].y_position==y){
                                    playerTokens[i].playerToken = true;
                                    horizontalTokens.push(playerTokens[i]);
                                    empty = false;
                                    x++;
                            }
                        }
                    }

                    //Previous
                    x = parseInt(token.x_position)-1;
                    y = parseInt(token.y_position);
                    var empty = false;
                    while(!empty){
                        empty = true;
                        for (var i = boardTokens.length - 1; i >= 0; i--) {
                            if( boardTokens[i].id != token.id && 
                                boardTokens[i].x_position == x && boardTokens[i].y_position==y){
                                boardTokens[i].playerToken = false;
                                horizontalTokens.push(boardTokens[i]);
                                empty = false;
                                x--;
                            }
                        }

                        for (var i = playerTokens.length - 1; i >= 0; i--) {
                            if( playerTokens[i].id != token.id && playerTokens[i].onBoard=="true" && 
                                playerTokens[i].x_position == x && playerTokens[i].y_position==y){
                                playerTokens[i].playerToken = true;
                                horizontalTokens.push(playerTokens[i]);
                                empty = false;
                                x--;
                            }
                        }
                    }

                    return horizontalTokens;
        }catch(ex){
            console.error("Error getHorizontalTokens",ex);
            throw ex;
        }
    }

    function getVerticalTokens(boardTokens, playerTokens, token){

        try{

                    var verticalTokens = new Array();
                    verticalTokens.push(token);
                    //Next
                    y = parseInt(token.y_position)+1;
                    x = parseInt(token.x_position);
                    var empty = false;
                    while(!empty){
                        empty = true;
                        for (var i = boardTokens.length - 1; i >= 0; i--) {
                            if( boardTokens[i].id != token.id && 
                                boardTokens[i].x_position == x && boardTokens[i].y_position==y){
                                boardTokens[i].playerToken = false;
                                verticalTokens.push(boardTokens[i]);
                                empty = false;
                                y++;
                            }
                        }

                        for (var i = playerTokens.length - 1; i >= 0; i--) {
                            if( playerTokens[i].id != token.id && playerTokens[i].onBoard=="true" && 
                                playerTokens[i].x_position == x && playerTokens[i].y_position==y){
                                    playerTokens[i].playerToken = true;
                                    verticalTokens.push(playerTokens[i]);
                                    empty = false;
                                    y++;
                            }
                        }
                    }

                    //Previous
                    y = parseInt(token.y_position)-1;
                    x = parseInt(token.x_position);
                    var empty = false;
                    while(!empty){
                        var empty = true;
                        for (var i = boardTokens.length - 1; i >= 0; i--) {
                            if( boardTokens[i].id != token.id && 
                                boardTokens[i].x_position == x && boardTokens[i].y_position==y){
                                boardTokens[i].playerToken = false;
                                verticalTokens.push(boardTokens[i]);
                                empty = false;
                                y--;
                            }
                        }

                        for (var i = playerTokens.length - 1; i >= 0; i--) {
                            if( playerTokens[i].id != token.id && playerTokens[i].onBoard=="true" && 
                                playerTokens[i].x_position == x && playerTokens[i].y_position==y){
                                    playerTokens[i].playerToken = true;
                                    verticalTokens.push(playerTokens[i]);
                                    empty = false;
                                    y--;
                            }
                        }
                    }
                    return verticalTokens;
        }catch(ex){
            console.error("Error getVerticalTokens",ex);
            throw ex;
        }
    }


    function isJoined(boardTokens, playerTokens){

        try{
                    //Check if the tokens are in correct position
            var correctPosition = true;
            if(boardTokens.length>0)
                correctPosition = isJoinToken(boardTokens, playerTokens);
            else
                correctPosition = isJoinTokenFirstMove(playerTokens);

            if(!correctPosition)
                return false;
            return true;
        }catch(ex){
            console.log("Error isJoined", ex);
            throw ex;
        }
    }
    
    function isJoinTokenFirstMove(playerTokens){

        try{
            console.log("isJoinTokenFirstMove");
            
            var tokensOnBoard = joinTokenFirstMove(playerTokens, null, null);

            var countTokensOnBoard = 0;
            for (var i = playerTokens.length - 1; i >= 0; i--) {
                if(playerTokens[i].onBoard)
                    countTokensOnBoard++;
            }
            console.log("Board tokens: "+tokensOnBoard.length);
            console.log("countTokensOnBoard: "+countTokensOnBoard);

            return tokensOnBoard.length==countTokensOnBoard;

        }catch(ex){
            console.log("Error isJoinTokenFirstMove", ex);
            throw ex;
        }
    }
    
    function joinTokenFirstMove(playerTokens, previous, tokensOnBoard){

        try{

            if(tokensOnBoard ==null)
                tokensOnBoard = new Array();

            //Previous board tokens check
            for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
                if(playerTokens[numBoardToken].onBoard && (previous==null || 
                    (playerTokens[numBoardToken].id != previous.id && playerTokens[numBoardToken].x_position==previous.x_position && playerTokens[numBoardToken].y_position==previous.y_position-1)))
                        //Check if the token is in the array
                        tokensOnBoard = joinTokenFirstMove_tokenInArray(playerTokens, playerTokens[numBoardToken], tokensOnBoard);
            }
            for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
                if(playerTokens[numBoardToken].onBoard && (previous==null || 
                    (playerTokens[numBoardToken].id != previous.id && playerTokens[numBoardToken].x_position==previous.x_position && playerTokens[numBoardToken].y_position==previous.y_position+1)))
                        //Check if the token is in the array
                        tokensOnBoard = joinTokenFirstMove_tokenInArray(playerTokens, playerTokens[numBoardToken], tokensOnBoard);
            }

            //Next board tokens check
            for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
                if(playerTokens[numBoardToken].onBoard && (previous==null || 
                    (playerTokens[numBoardToken].id != previous.id && playerTokens[numBoardToken].y_position==previous.y_position && playerTokens[numBoardToken].x_position==previous.x_position-1)))
                        //Check if the token is in the array
                        tokensOnBoard = joinTokenFirstMove_tokenInArray(playerTokens, playerTokens[numBoardToken], tokensOnBoard);
            }
            for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
                if(playerTokens[numBoardToken].onBoard && (previous==null || 
                    (playerTokens[numBoardToken].id != previous.id && playerTokens[numBoardToken].y_position==previous.y_position && playerTokens[numBoardToken].x_position==previous.x_position+1)))
                        //Check if the token is in the array
                        tokensOnBoard = joinTokenFirstMove_tokenInArray(playerTokens, playerTokens[numBoardToken], tokensOnBoard);
            }
            
            return tokensOnBoard;
        }catch(ex){
            console.log("Error joinTokenFirstMove", ex);
            throw ex;
        }

    }

    function joinTokenFirstMove_tokenInArray(playerTokens, token, tokensOnBoard){
        var isInArray = false;
        for (var i = tokensOnBoard.length - 1; i >= 0; i--) {
            if(tokensOnBoard[i].id == token.id)
                isInArray = true;
        }

        if(!isInArray){
            tokensOnBoard.push(token);
            joinTokenFirstMove(playerTokens, token, tokensOnBoard);
        }
        return tokensOnBoard;
    }

    function isJoinToken(boardTokens, playerTokens, token){

        for (var i = playerTokens.length - 1; i >= 0; i--) {
            if(playerTokens[i].onBoard == "true")
                if(!isJoinTokenCheck(boardTokens, playerTokens, playerTokens[i], null))
                    return false;
        };
        return true;
    }

    function isJoinTokenCheck(boardTokens, playerTokens, token, previoustoken){
        //Board tokens check
        if(boardTokens!=null && boardTokens.length>0){
            for (var numBoardToken = boardTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
                if( (boardTokens[numBoardToken].x_position==token.x_position && (boardTokens[numBoardToken].y_position==parseInt(token.y_position)-1 || boardTokens[numBoardToken].y_position==parseInt(token.y_position)+1)) ||
                    (boardTokens[numBoardToken].y_position==token.y_position && (boardTokens[numBoardToken].x_position==parseInt(token.x_position)-1 || boardTokens[numBoardToken].x_position==parseInt(token.x_position)+1)))
                    return true;                                
            }
        }

        //Board tokens check
        for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
            if(playerTokens[numBoardToken].onBoard == "true" && playerTokens[numBoardToken].id != token.id && (previoustoken==null || playerTokens[numBoardToken].id != previoustoken.id))
                if( (playerTokens[numBoardToken].x_position==token.x_position && (playerTokens[numBoardToken].y_position==parseInt(token.y_position)-1 || playerTokens[numBoardToken].y_position==parseInt(token.y_position)+1)) ||
                    (playerTokens[numBoardToken].y_position==token.y_position && (playerTokens[numBoardToken].x_position==parseInt(token.x_position)-1 || playerTokens[numBoardToken].x_position==parseInt(token.x_position)+1)))
                    return isJoinTokenCheck(boardTokens, playerTokens, playerTokens[numBoardToken], token);
        }
        return false;
    }

    /*function checkCorrectMove(game, playerTokens, token){

        console.log("Check correct move");

        var boardTokens = game.boardTokens;
        console.log("BoardTokens: "+boardTokens.length);

        for (var i = playerTokens.length - 1; i >= 0; i--) {
             
            //Board tokens check
            console.log("Check board tokens");
            if(boardTokens!=null && boardTokens.length>0){
                for (var numBoardToken = boardTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
                    if(boardTokens[numBoardToken].x_position==playerTokens[i].x_position && (boardTokens[numBoardToken].y_position==playerTokens[i].y_position-1 || boardTokens[numBoardToken].y_position==playerTokens[i].y_position+1))
                        return true;                                
                }
            }

            //Board tokens check
            console.log("Check player tokens");
            for (var numPlayerToken = playerTokens.length - 1; numPlayerToken >= 0; numPlayerToken--) {
                if(playerTokens[numPlayerToken].x_position==playerTokens[i].x_position && (playerTokens[numPlayerToken].y_position==playerTokens[i].y_position-1 || playerTokens[numPlayerToken].y_position==playerTokens[i].y_position+1))
                    return isJoinedToken(game, playerTokens);
                }
           }
        console.log("Check correct move "+false);
        return false;
    };*/
};

module.exports = ColorsShapes;


