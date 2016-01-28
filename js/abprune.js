/**
 * Created by Paul Smith on 28/01/16.
 */

var ABPrune = (function ABPrune() {

    return function ABPruneConstructor(depth, state) {
        var self = this; // Cache the `this` keyword
        self._depth = depth;
        self._state = state;

        self.alphabeta = function(){
            return self._alphabeta(self._state, self._depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        }

        self.minmax = function(){
            return self._minmax(self._state, self._depth, true);
        }

        self._alphabeta = function (state, depth, alpha, beta, maximizePlayer) {
            if (depth == 0 || !state.isMovePossible()) {
                var stateScore = state.getScore();
                return {sc: stateScore, st: state};
            }

            return max ? self._abmax(state, depth, alpha, beta) : self._abmin(state, depth, alpha, beta);
        };

        self._abmax = function (state, depth, alpha, beta) {
            var states = state.getSuccessors(true);
            var maxScoredState = null;
            for (var i = 0; i < states.length; i++) {
                var eval = self.alphabeta(states[i], depth - 1, alpha, beta, false);

                if (eval.sc > alpha) {
                    maxScoredState = states[i];
                    alpha = eval.sc
                }
                if (eval.sc >= beta) {
                    // beta cut-off
                    break;
                }
            }
            return {sc: alpha, st: maxScoredState};
        };

        self._abmin = function (state, depth, alpha, beta) {
            var states = state.getSuccessors(false);
            var minScoredState = null;
            for (var i = 0; i < states.length; i++) {
                var eval = self.alphabeta(states[i], depth - 1, alpha, beta, true);
                if (eval.sc < beta) {
                    minScoredState = states[i];
                    beta = eval.sc;
                }
                if (eval.sc <= alpha) {
                    // alpha cut-off
                    break;
                }
            }
            return {sc: beta, st: minScoredState};
        };


        self._minmax = function (state, depth, max) {

            if (depth == 0 || !state.isMovePossible()) {
                var score = state.getScore();
                return {s: score, n: state};
            }

            return max ? self._max(state, depth) : self._min(state, depth);

        };

        self._min = function (state, depth) {
            var minScore = Number.POSITIVE_INFINITY;
            var minScoredState = null;
            var states = state.getSuccessors(false);

            for (var i = 0; i < states.length; i++) {
                var eval = self.minmax(states[i], depth - 1, true);
                minScoredState = minScore < eval.s ? minScoredState : states[i];
                minScore = minScore < eval.s ? minScore : eval.n;
            }
            return {s: minScore, n: minScoredState};
        };

        self._max = function (state, depth) {
            var maxScore = Number.NEGATIVE_INFINITY;
            var maxScoredState = null;
            var states = state.getSuccessors(true);

            for (var i = 0; i < states.length; i++) {
                var eval = self.minmax(states[i], depth - 1, false);
                maxScoredState = maxScore > eval.s ? maxScoredState : states[i];
                maxScore = maxScore > eval.s ? maxScore : eval.n;
            }
            return {s: maxScore, n: maxScoredState};
        };

    };
}());