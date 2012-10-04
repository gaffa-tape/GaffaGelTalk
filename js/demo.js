;(function(undefined){
    //DRY up container creation        
    function newContainer(){
        return {
            type:"container",
            views:{
                content:[]
            }
        }
    }

    //DRY up button creation
    function newButton(){
        return {
            type:"button",
            actions:{
                click:[]
            },
            properties:{
                text:{}
            }
        }
    }

    //DRY up textbox creation
    function newTextbox(){
        return {
            type:"textbox",
            properties:{
                value:{},
                placeholder:{}
            }
        }
    }


    /////////////////////////////////
    // START OF VIEW DEFINITION
    /////////////////////////////////

    //Container for all content in the page
    var pageContainer = newContainer();

    //Filter box
    var filterBox = newTextbox();

    filterBox.properties.value.binding = "[todoFilter]";
    filterBox.properties.placeholder.value = "Filter Todos";
    filterBox.updateEventName = "change keyup";
    pageContainer.views.content.push(filterBox);

    //The list of todos
    var todoList = {
        type: "list",
        path: "[todos]",
        properties:{
            list:{
                binding:"(filterKeys [~] {todo (contains todo [todoFilter])})"
            },
            classes:{
                value: "todoList"
            }
        }
    }
    pageContainer.views.content.push(todoList);

    //the template view for each todo
    var todoTemplate = newContainer();
    todoList.properties.list.template = todoTemplate;

    //label for the todo
    var todoLabel = {
        type: "label",
        properties: {
            text: {
                binding: "[~]"
            }
        }
    }
    todoTemplate.views.content.push(todoLabel);

    //button to remove the todo
    var removeTodoButton = newButton();
    removeTodoButton.properties.text.value = "Remove Todo";
    todoTemplate.views.content.push(removeTodoButton);

    //the action that removes a todo from the model
    var removeTodoAction = {
        type:"remove",
        properties:{
            target:{
                binding:"[~]"
            }
        }
    }
    removeTodoButton.actions.click.push(removeTodoAction);

    //the input to allow users to add todo labels
    var newTodoTextbox = newTextbox();
    newTodoTextbox.properties.value.binding = "[newTodo]";
    newTodoTextbox.properties.placeholder.value = "Todo Description";
    pageContainer.views.content.push(newTodoTextbox);

    //the add todo button
    var addTodoButton = newButton();
    addTodoButton.properties.text.value = "Add Todo";
    pageContainer.views.content.push(addTodoButton);

    //the action to push a new todo to the model
    var addTodoAction = {
        type:"push",
        properties:{
            target:{
                binding:"[todos]"
            },
            source:{
                binding:"[newTodo]"
            }
        }
    }
    addTodoButton.actions.click.push(addTodoAction);

    /////////////////////////////////
    // END OF VIEW DEFINITION
    /////////////////////////////////



    //set the default model
    window.gaffa.model.set({
        todos:["stuff", "things"]
    });

    //Add local storage behaviours
    //Do this after you set model defaults.
    window.gaffa.behaviours.add([	
        {            
                type: "modelChange",
                binding: "[todos]",
                actions: [
                    {
                        type: "store",
                        location: "local",
                        properties: {
                            source: {
                                binding: "[todos]"
                            },
                            target:{
                                binding: "[todoList]"
                            }
                        }
                    }
                ]
            },
            {
                binding: "[todos]",
                type: "pageLoad",
                actions: [
                    {
                        type: "fetch",
                        location: "local",
                        properties: {
                            target: {
                                binding: "[todos]"
                            },
                            source: {
                                binding: "[todoList]"
                            }
                        }
                    }
                ]
            }
        ]);

    //add the views to gaffa
    window.gaffa.views.add(pageContainer);

    //Set some default model data
    window.gaffa.model.set("[todoFilter]","");

    //make gaffa pull model data from the page's queryString
    window.gaffa.queryStringToModel();

    //wait till there is a body element
    //if no renderTarget is provided, this is where gaffa will render to.
    $(document).ready(function(){
        //render the view
        gaffa.views.renderTarget = $(".gaffaDemo")[0];
        window.gaffa.views.render();
    });
})();