# atom-repl

This began as a project to implement REPL interaction in several languages, but this is very complicated on Windows (interacting with different types of pseudo executables) has proved difficult. So this is a collection of "Fake" REPLS, which means your code is written to a temporary file and executed in the background.

Until I can figure out how to interactively read REPLs for Lisp/Python and Lua on windows, this is the default functionality of Windows. When I move to developing it on Linux, which is a more sane environment, REPLs might be true in that case. Also there is
the possibility of interfacing with SLIME for Lisp REPLS.

You can send the entire buffer, a selection, or multiple lines to the program in question. `alt-8` sends lines, `alt-9` sends selections and `alt-0` sends the entire buffer.

For code like PHP, when sending lines or selections, `<?php` is automatically prepended for you.

This project is done in vanilla Javascript/Nodejs/JSON. No coffeescript, No cson.

If you make a pull request in Coffeescript and cson, I won't merge it, but I'll probably port it into vanilla Javascript if it's awesome.

### Currently supported

* PHP
* Lua (like ULua)
* Lisp (such as CLISP)
* Python

### Soon to be supported

* Honest REPLS (at least for Python, Ruby and Lisp)

## Hacking

Hacking is welcome and encouraged. Each type of REPL is it's own class, so you can choose to hack on your own favorite language's
features without really having to worry about any of the others. Someone into Python could hack on the Python class, and actually
get some Python specific features up and running without even having to worry about Lisp, or PHP or what not.

### Generic Features

Place all generic features into atom-repl-utils.js

Or if you intend to create some additional helper class, do that. I am pretty easy going. Just make sure you do it in vanilla javascript, not coffeescript.

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
