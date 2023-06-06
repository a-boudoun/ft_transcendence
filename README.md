# ft_transcendence
This project is about creating a website for the mighty Pong contest

**Engine :** You need engines to update the simulations of your Matter.js world. The Engine module provides different methods and properties that allow you to control the behavior of different engines.

**Render:** A renderer is required for you to create actual bodies in your simulation that your users can see. You can use it to develop basic games with its support for sprites, etc.

**Runner:** Bodies in any world that you simulate will interact with each other continuously. The runner module handles these continuous updates of the engine and the world.

**Bodies:** The Bodies module contains different methods to help you create rigid bodies with common shapes like a circle, rectangle, or trapezium.

**Body:** This module provides you with different methods and properties to create and manipulate the rigid bodies that you have created using the functions from the Bodies module. This module allows you to scale, rotate, or translate individual bodies. It also has functions to let you specify the velocity, density, or inertia of different bodies. Because of so many functions, the third tutorial in this series only discusses the methods and properties available in the Body module.

**Composites:** Just like the Bodies module, this module contains different methods that you can use to create composite bodies with common configurations. For example, you can create a stack or pyramid of rectangular boxes using just a single method with the help of the Composites module.

**Composite:** The Composite module has methods and properties that allow you to create and manipulate composite bodies. You can read more about the Composite and Composites modules in the fourth tutorial of the series.

**Constraint:** This module allows you to create and manipulate constraints. You can use a constraint to make sure that two bodies or a fixed world-space point and a body maintain a fixed distance. It is similar to connecting two bodies through a steel rod. You can modify the stiffness of these constraints so that the rod starts acting more like springs. Matter.js uses constraints when creating a Newton's cradle or a chain composite.

**MouseConstraint:** This module provides you with methods and properties that let you create and manipulate mouse constraints. This is helpful when you want different bodies in the world to interact with the user.