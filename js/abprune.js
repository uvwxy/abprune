/**
 * Created by Paul Smith code@uvwxy.de on 28/01/16.
 */

var ABPruneGame = (function () {
    return function ABPruneGameConstructor(implementation) {
        var self = this;

        self.getSuccessors = function () {
            throw new TypeError('getSuccessors not implemented')
        };
        self.isGameOver = function () {
            throw new TypeError('isGameOver not implemented')
        };
        self.getScore = function () {
            throw new TypeError('getScore not implemented')
        };
        self.isMoveValid = function () {
            throw new TypeError('isMoveValid not implemented')
        };
        self._copyFunctions = function (state) {
            state.getSuccessors = this.getSuccessors;
            state.isGameOver = this.isGameOver;
            state.getScore = this.getScore;
            state.isMoveValid = this.isMoveValid;
            state._copyFunctions = self._copyFunctions;
        };

        if (implementation) {
            // copy functions from implementation to created instance
            var cc = self._copyFunctions.bind(implementation);
            cc(self);
        }
    };
})();

var ABPruneSearch = (function ABPrune() {

    return function ABPruneConstructor(depth, state) {
        var self = this; // Cache the `this` keyword
        self._depth = depth;
        self._state = state;

        self.searchAlphaBeta = function () {
            return self._alphabeta(self._state, self._depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        };


        self._alphabeta = function (state, depth, alpha, beta, max) {
            if (depth == 0 || state.isGameOver()) {
                state.getScore(1);
                return state;
            }

            return max ? self._abmax(state, depth, alpha, beta) : self._abmin(state, depth, alpha, beta);
        };

        self._abmax = function (state, depth, alpha, beta) {
            var states = state.getSuccessors(true);
            var maxScoredState = null;
            for (var i = 0; i < states.length; i++) {
                var eval = self._alphabeta(states[i], depth - 1, alpha, beta, false);
                if (eval.score > alpha) {
                    maxScoredState = states[i];
                    alpha = eval.score
                }
                if (eval.score >= beta) {
                    // beta cut-off
                    break;
                }
            }
            maxScoredState = maxScoredState || {}; // not every path returns a state
            maxScoredState.score = alpha;
            return maxScoredState;
        };

        self._abmin = function (state, depth, alpha, beta) {
            var states = state.getSuccessors(false);
            var minScoredState = null;
            for (var i = 0; i < states.length; i++) {
                var eval = self._alphabeta(states[i], depth - 1, alpha, beta, true);
                if (eval.score < beta) {
                    minScoredState = states[i];
                    beta = eval.score;
                }
                if (eval.score <= alpha) {
                    // alpha cut-off
                    break;
                }
            }
            minScoredState = minScoredState || {}; // not every path returns a state
            minScoredState.score = beta;
            return minScoredState;
        };

        self.searchMinMax = function () {
            return self._minmax(self._state, self._depth, true);
        };

        self._minmax = function (state, depth, max) {
            if (depth == 0 || state.isGameOver()) {
                state.getScore(1);
                return state;
            }

            return max ? self._max(state, depth) : self._min(state, depth);

        };

        self._min = function (state, depth) {
            var minScore = Number.POSITIVE_INFINITY;
            var minScoredState = null;
            var states = state.getSuccessors(false);

            for (var i = 0; i < states.length; i++) {
                var eval = self._minmax(states[i], depth - 1, true);
                minScoredState = minScore < eval.score ? minScoredState : states[i];
                minScore = minScore < eval.score ? minScore : eval.score;
            }
            minScoredState.score = minScore;
            return minScoredState;
        };

        self._max = function (state, depth) {
            var maxScore = Number.NEGATIVE_INFINITY;
            var maxScoredState = null;
            var states = state.getSuccessors(true);

            for (var i = 0; i < states.length; i++) {
                var eval = self._minmax(states[i], depth - 1, false);
                maxScoredState = maxScore > eval.score ? maxScoredState : states[i];
                maxScore = maxScore > eval.score ? maxScore : eval.score;
            }
            maxScoredState.score = maxScore;
            return maxScoredState;
        };

    };
}());