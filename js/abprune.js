/**
 * Created by Paul Smith on 28/01/16.
 */

var ABPrune = (function ABPrune() {

    return function ABPruneConstructor(depth, node) {
        var self = this; // Cache the `this` keyword
        self._depth = depth;
        self._node = node;

        self.alphabeta = function () {
            return self._alphabeta(self._node, self._depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        }

        self.minmax = function () {
            return self._minmax(self._node, self._depth, true);
        }

        self._alphabeta = function (node, depth, alpha, beta, maximizePlayer) {
            if (depth == 0 || !node.nodesAvailable()) {
                var nodeScore = node.getScore();
                return {s: nodeScore, n: node};
            }

            return max ? self._abmax(node, depth, alpha, beta) : self._abmin(node, depth, alpha, beta);
        };

        self._abmax = function (node, depth, alpha, beta) {
            var nodes = node.getChildNodes(true);
            var maxScoredNode = null;
            for (var i = 0; i < nodes.length; i++) {
                var eval = self.alphabeta(nodes[i], depth - 1, alpha, beta, false);

                if (eval.s > alpha) {
                    maxScoredNode = nodes[i];
                    alpha = eval.s
                }
                if (eval.s >= beta) {
                    // beta cut-off
                    break;
                }
            }
            return {s: alpha, n: maxScoredNode};
        };

        self._abmin = function (node, depth, alpha, beta) {
            var nodes = node.getChildNodes(false);
            var minScoredNode = null;
            for (var i = 0; i < nodes.length; i++) {
                var eval = self.alphabeta(nodes[i], depth - 1, alpha, beta, true);
                if (eval.s < beta) {
                    minScoredNode = nodes[i];
                    beta = eval.s;
                }
                if (eval.s <= alpha) {
                    // alpha cut-off
                    break;
                }
            }
            return {s: beta, n: minScoredNode};
        };


        self._minmax = function (node, depth, max) {

            if (depth == 0 || !node.nodesAvailable()) {
                var score = node.getScore();
                return {s: score, n: node};
            }

            return max ? self._max(node, depth) : self._min(node, depth);

        };

        self._min = function (node, depth) {
            var minScore = Number.POSITIVE_INFINITY;
            var minScoredNode = null;
            var nodes = node.getChildNodes(false);

            for (var i = 0; i < nodes.length; i++) {
                var eval = self.minmax(nodes[i], depth - 1, true);
                minScoredNode = minScore < eval.s ? minScoredNode : nodes[i];
                minScore = minScore < eval.s ? minScore : eval.n;
            }
            return {s: minScore, n: minScoredNode};
        };

        self._max = function (node, depth) {
            var maxScore = Number.NEGATIVE_INFINITY;
            var maxScoredNode = null;
            var nodes = node.getChildNodes(true);

            for (var i = 0; i < nodes.length; i++) {
                var eval = self.minmax(nodes[i], depth - 1, false);
                maxScoredNode = maxScore > eval.s ? maxScoredNode : nodes[i];
                maxScore = maxScore > eval.s ? maxScore : eval.n;
            }
            return {s: maxScore, n: maxScoredNode};
        };
        
    };
}());