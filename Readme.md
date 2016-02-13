# ABPrune

A JavaScript library to provide a minimax, as well as an alpha-beta search algorithm



# Using ABPrune

## Including via Bower

Run `bower install abprune --save` to add ABPrune as a dependency to your project.

## Implementing the Search Interface

The ABPrune library assumes that you implement the following interface:

```javascript
obj.hasMoves = function (playerId) {
    throw new TypeError('hasMoves not implemented')
};
obj.getSuccessors = function (playerId) {
    throw new TypeError('getSuccessors not implemented')
};
obj.isGameOver = function () {
    throw new TypeError('isGameOver not implemented')
};
obj.getScore = function (playerId) {
    throw new TypeError('getScore not implemented')
};
obj.isMoveValid = function (location, playerId) {
    throw new TypeError('isMoveValid not implemented')
};
obj.initialize = function initialize(size) {
    throw new TypeError('initialize not implemented')
};

```

Thus, you can instantiate your game by providing an object that implements the given functions, and pass it to the constructor:

```javascript
var myGame = new ABPrune.Game({/*  <implement functions here  */});
```

An example (taken from `test/spec/abprune.js`):


```javascript
var game = new ABPrune.Game({
    hasMoves : function(playerId){
        for (var i = 0; i < this.data.length; i++) {
            if (this.isMoveValid(i, playerId)) {
                return true;
            }
        }

        return false;
    },
    getSuccessors: function (playerId) {
        var succs = [];
        // returns a list of states, one for each possible move
        if (!this.isGameOver()) {
            for (var move = 0; move < this.data.length; move++) {
                if (this.isMoveValid(move, playerId)) {
                    var s = {data: this.data.slice(0)};
                    s.data[move] = playerId;
                    s.move = move;
                    this._copyFunctions(s);
                    succs.push(s)
                }
            }
        }
        return succs;
    },
    isMoveValid: function (location, playerId) {
        return this.data[location] == 0;
    },
    isGameOver: function () {
        // checks whether any party can move
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i] == 0) {
                return false;
            }
        }
        return true;
    },
    getScore: function (playerId) {
        this.score = this.data.reduce(function (pV, cV, cI) {
            return pV + (cV == playerId ? cI : 0);
        }, 0);

        return this.score;
    },
    initialize: function (size) {
        var state = {};
        this._copyFunctions(state);

        // Setup empty game [0,1,2,...,size-1]
        state.data = Array(size).fill(0);
        return state;
    }
});
```

### Important Detail

Please make sure that the function `getSuccessors` creates a new game state in a similar fashion:

```javascript
// clone actual game data
var s = {data: this.data.slice(0)};

// create new state by moving with the playerId
s.data[move] = playerId;

// !important! add the move to the state !important!
s.move = move;
// !important! add functions, s.t. recursion of search works !important!
this._copyFunctions(s);
```

## Searching

Now that we have a variable `game` we can use this to search for the next best move:

```javascript
var state = game.initialize(3);
var result = new ABPrune.AlphaBeta(1, state).search();
```

Where result contains the resulting state, move and score:


```javascript
// contents of result
{
    data : {/* game data */},
    score : 1337,
    move : {/* move data */}
}
```


## ABPrune in Action
An implementation currently using ABPrune can be found 
[here](https://github.com/uvwxy/web-reversi/blob/master/app/scripts/reversi-game.js)(see object `ReversiLogic`), and in action [here](http://uvwxy.github.io/web-reversi)



# Developing ABPrune

## Dependencies

Run `npm install` to install the required modules via the Node Package Manager.

## Testing

Run `npm test` to run the tests.
