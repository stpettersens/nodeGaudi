Building with nodeGaudi example #1
------------------------------
Simple example Hello World program
written in C++ and the Gaudi build file to build it.

Here you will see that `nodeGaudi` is invoked in a very
similar manner to the traditional `make` tool.

Assuming `nodeGaudi` is installed, to build the program (invoke `build` action) just
run:

> `nodeGaudi`

To remove the compiled program, invoke the `clean` action with:

> `nodeGaudi clean`

You have a choice of using either the JSON-based or CSON-based (*Coffee Script Object Notation*) build file. nodeGaudi defaults to use **build.json** first; so to use **build.cson** do this...

Build program (the action name `build` is default, so inclusion is optional):

> `nodeGaudi -f build.cson [build]`

Clean up:

> `nodeGaudi -f build.cson clean`
