## Shaman Factory - by IoT Shaman

![npm badge](https://img.shields.io/npm/v/shaman-factory.svg) [![Coverage Status](https://coveralls.io/repos/github/iotshaman/shaman-cli/badge.svg?branch=main)](https://coveralls.io/github/iotshaman/shaman-cli?branch=main)

## Forget about the tooling and focus on solutions!

*Get started working on core business logic faster by streamlining your application scaffolding and simplifying your development toolchain.*

Shaman Factory is a *polyglot monorepo solution container* (translation below :grin:) that aims to increase productivity by abstracting development requirements that have little-to-zero value for the business. Before we continue, lets translate that to plain-english, so we can make sure we are all on the same page. 

A *polyglot solution* is a fancy way of saying you are using more than one coding language to solve a problem. A *monorepo* is a way of organizing source code into separate projects, but storing all of those **projects** in a single source repository where they can interact with and depend on each other. So, altogether, a *polyglot monorepo solution container* is a tool that allows developers to choose from one-to-many languages when developing a solution, encourages them to break the solution down into distinct projects, then stores the projects together in one source repository, allowing them to depend on one another. 

So what does this mean, practically? Well, here are some of the immediate benefits of using Shaman Factory:

1. **Devs only need to know 1 CLI tool.** Need to build a solution that has both Typescript and c# projects? No problem, one command will do both: `sf build`. Need to install dependencies for a solution that has multiple languages? No problem, just run `sf install`. You get the idea...
2. **Save hours of time when starting new projects.** Shaman Factory comes included with light-weight (but sophisticated) starter templates that can be created and customized simply by defining them in a [solution file](#solution-file) then running the [scaffold command](#scaffold-command). These templates are already broken down along "project type" lines (library, sever, client, etc) which also encourages good separation-of-concerns.
3. **Allow developers to use the right language for the task at hand.** Since Shaman Factory abstracts the underlying toolsets related to referencing, installing, building, and publishing software projects, developers can pick the right language / environment to provide an optimal solution, without worrying about learning the different toolsets associated with each language / environment.
4. **Add higher-level abstraction to languages without monorepo capabilities.** While some environments like .NET already have the concept of a "solution" (implementation of monorepo pattern), some environments like Node JS do not. While this doesn't prevent developers from breaking down their solutions along project lines, it does add lots of manual work when referencing, installing, building, and publishing these disparate projects. For example, if you have a Node JS project that references another Node JS project, you must remember to install and build the *child* project before installing and building the *dependent* project. However, with Shaman Factory this is no longer a concern; by defining the different projects in your solution file, Shaman Factory can infer the correct dependency graph, and install, build and publish projects in the correct order, regardless of language / environment.
5. **Reduce onboarding time by standardizing solution declaration and scaffolding.** Onboarding new team members can be very time consuming, especially if the new developer is not familiar with the different toolsets related to your development environment. However, if every project is scaffolded, installed, built and published using one tool (Shaman Factory) then adding new team members to a company, or project, gets a lot easier: just teach them 1 tool. If they are already familiar with Shaman Factory, even better, they are ready to hit the ground running on day one. 


## Installation

To install Shaman Factory on your machine, first install Node JS then run the following command:

```sh
npm i -g shaman-factory
```

*NOTE: You may need elevated permissions to run this command*

## Language Support

At the time of writing this REAMDE file, Shaman Factory only supports 2 "environments": *node*, and *dotnet*. While the "node" (Node JS) environment only supports the Typescript language, the "dotnet" (.NET 6) environment will support several languages. Please refer to the [project templates](https://github.com/iotshaman/shaman-factory/tree/v2/factory-cli/data/templates) documentation for more information about the available environments and languages. 

*NOTE: We will be adding support for additional environments / languages in the future, so check in periodically to see what new languages are available.*

## Solution File

Some commands require the existence of a "solution" file, which indicates what projects (servers, libraries, database libraries, etc.) are available as part of the solution. This file should be called "shaman.json", and has the following interface:

```ts
export class Solution {
  name: string;
  projects: SolutionProject[];
  transform?: ProjectTransformation[];
  auth?: TemplateAuthorization;
}

export class SolutionProject {
  name: string;
  environment: string;
  template: string;
  path: string;
  custom?: boolean;
  language?: string;
  include?: string[];
  specs?: {[spec: string]: any};
  runtimeDependencies?: string[];
}

export class ProjectTransformation {
  targetProject: string;
  transformation: string;
  sourceProject?: string;
  specs?: {[spec: string]: any};
}

export class TemplateAuthorization {
  email: string;
  token: string;
}
```

For example, if you have a node js solution that includes a website, library, database library, and a server, it could look like this:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "sample-website",
      "environment": "node",
      "template": "node-shaman-website",
      "path": "client",
      "runtimeDependencies": [
        "sample-server"
      ]
    },
    {
      "name": "sample-database",
      "environment": "node",
      "template": "node-shaman-database",
      "path": "database"
    },
    {
      "name": "sample-library",
      "environment": "node",
      "template": "node-typescript-library",
      "path": "library",
      "include": [
        "sample-database"
      ]
    },
    {
      "name": "sample-server",
      "environment": "node",
      "template": "node-express-server",
      "path": "server",
      "include": [
        "sample-database",
        "sample-library"
      ]
    }
  ],
  "transform": [
    {
      "targetProject": "sample-server",
      "transformation": "compose:datacontext",
      "sourceProject": "sample-database"
    }
  ]
}
```

*Note: All paths should be relative to the solution file*

### Project Specs
Some project types (for specific environments) allow you to provide "specs" to further customize the auto-generated source code. For more information regarding project specs, please refer to the [project templates](https://github.com/iotshaman/shaman-factory/tree/v2/factory-cli/data/templates) documentation.

### Transformations
Some project types (for specific environments) allow you to perform "transformations" on the auto-generated source code, to create custom source code during initial scaffolding. For example, you can use a transformation to automatically write "data context" composition for a server project (that depends on a database library). For more information regarding project transformations, please refer to the [project templates](https://github.com/iotshaman/shaman-factory/tree/v2/factory-cli/data/templates) documentation.

## CLI Reference

Once you have installed Shaman Factory, you can access it by invoking "sf" (short-hand for Shaman Factory) in a command line interface (CMD, bash, etc). The format for executing commands looks like this:

```sh
sf [command] [...arguments]
```

**[command]:** Available values: *scaffold, install, build, run, serve, publish, --version*  
**[...arguments]:** A list of arguments that vary, depending on the command provided.  

### Scaffold Command

The scaffold command requires the existence of a solution file, and will iterate over the available projects and scaffold them all. The syntax for the scaffold command is as follows:

```sh
sf scaffold [--filePath=FILEPATH]
```

**[filePath]:** (Optional) relative path to the shaman.json file (including file name). If no value is provided, the default value is the current working directory.

### Generate Command

The generate command creates a solution file and then runs the the [scaffold command](#scaffold-command). The generate command is interactive and will prompt the user to provide information that will determine how the solution file is created. The solution file will largely be modeled after the user provided recipe or templates. A pre-made [default recipe](https://github.com/iotshaman/shaman-factory/tree/v2/factory-cli/data/recipes#shaman-factory-recipes) is available. The generate command can also be used to add projects to an existing solution file. The syntax for the generate command is as follows:

```sh
sf generate [-add] [--name=NAME] [--recipe=RECIPE] [--template=TEMPLATE] [--filePath=FILEPATH]
```

**[add]:** (flag) Instead of creating a new solution file, generate will add new projects to an existing solution file then run the [scaffold command](#scaffold-command). Generate will prompt the user to enter the names of the templates they would like to add. Alternatively, one project can quickly be added to the solution file if the template argument is provided.  
**[name]:** (optional) The name to be used for the generated solution file. If not provided, generate will prompt the user the enter the name to be used.  
**[recipe]:** (optional) The name of the recipe to be used for the generated solution file. If not provided, generate will prompt the user the enter the name of the recipe to be used.  
**[template]:** (optional) The name of the template to be used for the generated solution file. If not provided, generate will prompt the user the enter the name of the template to be used. If using the add flag, generate will add one project (modeled after the template) to the existing solution file.  
**[filePath]:** (optional) Relative path to where the the shaman.json file should be created (including file name). If using the add flag, the relative path to the existing shaman.json file (including file name). If no value is provided, the default value is the current working directory.  

### Install Command

The install command requires the existence of a solution file, and will iterate over the available projects and install them. If no "environment" argument is provided (or wildcard value * is provided), Shaman Factory will iterate over the unique "environment" types, and perform independent installs for each. The syntax for the install command is as follows:

```sh
sf install [--environment=ENVIRONMENT] [--filePath=FILEPATH]
```

**[environment]:** (Optional) Indicates the coding environment, which will help determine which projects should be installed. Available values are: *node*, *dotnet*, *\**  
**[filePath]:** (Optional) relative path to the shaman.json file (including file name). If no value is provided, the default value is the current working directory.

### Build Command

The build command requires the existence of a solution file, and will iterate over the available projects and build them. If no "environment" argument is provided (or wildcard value * is provided), Shaman Factory will iterate over the unique "environment" types, and perform independent builds for each. The syntax for the build command is as follows:

```sh
sf build [--environment=ENVIRONMENT] [--filePath=FILEPATH]
```

**[environment]:** (Optional) Indicates the coding environment, which will help determine which projects should be built. Available values are: *node*, *dotnet*, *\**  
**[filePath]:** (Optional) relative path to the shaman.json file (including file name). If no value is provided, the default value is the current working directory.

*Note: In order for the build command to work, each project needs to have a script (in package.json) called "build". If you used Shaman Factory to scaffold your code, this is already available.*

### Run Command

The run command requires the existence of a solution file, and will execute a "start" script for a specific project; if no script is specified, it will use the project environment's default "start" script. The syntax for the run command is as follows:

```sh
sf run [--project=PROJECT] [--script=SCRIPT] [filePath=FILEPATH]
```

**[project]:** The name of the project for which you would like to execute the provided (or default) script. The provided project value must match a project name in your solution file.  
**[script]:** (Optional) The project script to be executed; if no value is provided, the default value will be the default 'start' script for the project's environment ('start' for Node JS, 'run' for .NET, etc.).  
**[filePath]:** (Optional) relative path to the shaman.json file (including file name). If no value is provided, the default value is the current working directory.

*Note: In order for the run command to work, the specified project needs to have a script that corresponds to the provided (or default) script value. For Node JS, this means adding a "script" property to your package.json file.*

### Serve Command

The serve command requires the existence of a solution file, and will execute the 'start' script for 1-to-many projects. For example, if you have a website and a server, you can use the serve command to start both the server and the website, with 1 command. In order for Shaman Factory to start multiple projects, you must define any "runtime dependencies" in the "runtimeDependencies" property of the respective "parent" project (the one that depends on the other). So, for the previous example (server and website) you would want to register the server project as a runtime dependency of the website project.

The syntax for the serve command is as follows:

```sh
sf serve [--project=PROJECT]
```

**[project]:** The name of the project for which you would like to serve. The provided project value must match a project name in your solution file. Note: any project names listed as "runtime dependencies" will be started first, and runtime dependencies can be nested.  
**[filePath]:** (Optional) relative path to the shaman.json file (including file name). If no value is provided, the default value is the current working directory.

*Note: In order for the serve command to work, the specified project (any and runtime dependencies) must have a 'start' script (in package.json).*

### Publish Command

The publish command requires the existence of a solution file, and will execute a production build for 1-to-many projects. Every environment creates a different type of production build (for example, a C# server will create an executable file, and a Node JS server will generate several .js files). The syntax for the publish command is as follows:

```sh
sf publish [--environment=ENVIRONMENT] [--filePath=FILEPATH]
```

**[environment]:** (Optional) Indicates the coding environment, which will help determine which projects should be built. Available values are: *node*, *dotnet*, *\**  
**[filePath]:** (Optional) relative path to the shaman.json file (including file name). If no value is provided, the default value is the current working directory.

The publish command has built-in helpers for common production build needs (for example, copying configuration files). In order to leverage these helpers (called "instructions") you will need to add a spec named "publish" to the desired solution project configuration, and provide an array of instructions. The interface for publish instructions is as follows:

```ts
export interface IPublishInstruction {
  instruction: string;
  arguments: any;
}
```

#### Publish Instructions

**Copy Files**\
To copy resource files add a publish instruction like the following:

```json
{
  ...
  "specs": {
    "publish": [
      {
        "instruction": "copy",
        "arguments": [
          {
            "from": "relative/path/from/project/root/foobar.txt",
            "to": "new/path/for/bin/folder/foobar.txt"
          }
        ]
      }
    ]
  }
  ...
}
```

**Update JSON**\
To update JSON values in a given project, add publish instruction like the following:
```json
{
  ...
  "specs": {
    "publish": [
      {
        "instruction": "json",
        "arguments": [
          {
            "path": "new/path/for/bin/folder/file.json",
            "replace": {
              "foo": "bar"
            }
          }
        ]
      }
    ]
  }
  ...
}
```

*NOTE:* The "replace" object performs a shallow update, so you must deep-nest any replacement values. 

**Create Directories**\
To create directories in your publish folder, add a publish instruction like the following:

```json
{
  ...
  "specs": {
    "publish": [
      {
        "instruction": "mkdir",
        "arguments": [
          "relative/path/from/project/root/folder1",
          "relative/path/from/project/root/folder2"
        ]
      }
    ]
  }
  ...
}
```

### List Command

The list command can be used to view a list of available templates and recipes.  

The syntax for the list command is as follows:  
  
  ```sh
  sf ls -templates
  ```
  to list templates, or...
  ```sh
  sf ls -recipes
  ```
  to list recipes.

### Version Command

The version command can be invoked to determine what version of Shaman Factory is currently installed. 

The syntax for the serve command is as follows:

```sh
sf --version
```

## Project Dependencies

Sometimes, one project in a solution will be dependent on another project; when this happens, you may need to instruct the Shaman Factory about these dependencies. If you know these project dependencies when scaffolding a solution (using Shaman Factory), you can simply define these dependencies in your [solution file](#solution-file) by adding the name of the *dependent* project to the "include" property of the *parent* project; then, when you run the "scaffold" command it will automatically install these dependencies, and future builds will know the correct order. If you **do not** know the project dependencies when scaffolding, or you do not use the Shaman Factory to scaffold your code, you will need to manually install your dependencies in any *parent* project's package.json file, then update your solution file to reflect the relationship.
