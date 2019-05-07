//Storage Controller

//Item Controller
const ItemCtrl = (function(){
    const Item = function(id, title){
        this.id = id;
        this.title = title;
    }

    const data = {
        items: [
            // {id: 0, title: 'Read chapter 1'},
            // {id: 1, title: 'Buy apples'},
            // {id: 2, title: 'cook dinner'}
        ],
        currentItem: null
    }

    //Public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(title){
            let ID;
            //Create id
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //create new item
            newItem = new Item(ID, title);

            //Add item to data
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        strikeItem: function(title){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    var strikeVal = title.strike();
                    item.title = strikeVal;
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        logData: function(){
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        doneBtn: '.done-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        listItems: '#item-list li'
    }
    //Public methods
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.title} </strong> 
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        
        getItemInput: function(){
            return {
                title: document.querySelector(UISelectors.itemNameInput).value
            }
        },

        addListItem: function(item){
            //Show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            //add html
            li.innerHTML = `<strong>${item.title} </strong> 
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
            return 
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //COonvert nodelist into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.title} </strong> 
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showList: function(){
            document.querySelector(UISelectors.doneBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline'; 
            document.querySelector(UISelectors.itemNameInput).disabled = true;

        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.doneBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'none';

        },
        
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().title;
            UICtrl.showList();
        },
        
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App Controller
const AppCtrl = (function(ItemCtrl, UICtrl){

    //Load event listeners
    const loadEventListeners = function(){

        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item click event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditSubmit);

        //Done item click event
        document.querySelector(UISelectors.doneBtn).addEventListener('click', itemDoneSubmit);

    }

    //Add item submit
    const itemAddSubmit = function(e){
        //Get form input from UICtrl
        const input = UICtrl.getItemInput();

        //check for title input
        if(input.title !== ''){
            //Add item
            const newItem = ItemCtrl.addItem(input.title);
            //Add item to UI list
            UICtrl.addListItem(newItem);
        }
        //Clear fields
        UICtrl.clearInput();
        e.preventDefault();
    }

    //item edit submit
    const itemEditSubmit = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;
            //break id into array
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);

            //get item
            const itemEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //item done submit 
    const itemDoneSubmit = function(e){
       
        const input = UICtrl.getItemInput();
        const doneItem = ItemCtrl.strikeItem(input.title);
        
        //Update UI
        UICtrl.updateListItem(doneItem);
        //clear edit fields
        UICtrl.clearEditState();
        e.preventDefault();
    }
    //Public methods
    return {
        init: function(){

            //Clear edit state
            UICtrl.clearEditState();
            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //Populate list with items
                UICtrl.populateItemList(items);
            }
            
            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

AppCtrl.init();