  // Test esprima
  $(document).ready(() => {

    var $console = $("#repl-console"),
        $repl = $("#repl-code"),
        defaultJS = 'console.log(1 + 2); \n' +
                    'console.log(1 + "2"); \n';
                    // 'console.log("1" + "2");  \n' +
                    // 'console.log(10 + []); \n' +
                    // 'console.log([] + 10);  \n' +
                    // 'console.log([] + "1");  \n' +
                    // 'console.log("1" + []);';

    // set a default code sample to repl.
    $repl.val(defaultJS);

    var cons = {}

    cons.log = function(/* args */) {
        console.log('cons.log called');
        var args = Array.prototype.slice.call(arguments);

        $console.append(args.join('') + "<br>");
        console.log(args.join(''));
    }

    // Create AST, replace elements and execute code
    var runReplCode = function(code) {
        var ast  = esprima.parse(code);
        estraverse.traverse(ast, {
            enter: function(node) {
                if (node.type === "BinaryExpression") {
                    replacePlusByADD(node);
                }
                else if (node.type === "CallExpression" && node.callee && node.callee.object && node.callee.object.name == 'console') {
                    replaceConsole(node);
                }
            }
        });
        code = escodegen.generate(ast);
        console.log(code);
        eval(code);

        console.log('Great Success!');
    }

    $("#repl-content").submit(function(event) {
        var code = $repl.val();
        runReplCode(code);
        event.preventDefault();
    });

    // TODO: find nodes where type == "BinaryExpression"


    // get new nodes for replacing  x + y operator by sum(x, y) function call from Abstract Syntax Tree Object
    function replacePlusByADD(node) {
        // get arguments
        var a = node.left,
            b = node.right;

        node.type = "CallExpression";
        node.callee = {
          "type": "Identifier",
          "name": "ADD"
        };
        node.arguments = [a, b];

        // reset unnecessary properties
        node.left = null;
        node.right = null;
        node.operator = null;

        return node;
    }

    // need to redirect console.log statements to custom log area
    function replaceConsole(node) {
        console.log(node);
        node.callee.object.name = "cons";
    }
});
