//Storage Controller
const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));    
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();
//Item Controller
const ItemCtrl = (function(){
    const Item = function(id, title){
        this.id = id;
        this.title = title;
    }

    const data = {
        // items: [
        //     // {id: 0, title: 'Read chapter 1'},
        //     // {id: 1, title: 'Buy apples'},
        //     // {id: 2, title: 'cook dinner'}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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
                    var strikeVal = title;
                    item.title = strikeVal;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });
            
            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
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
        clearBtn: '.clear-btn',
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
                    document.querySelector(`#${itemId}`).innerHTML = `<strike>${item.title} </strike> 
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showList: function(){
            document.querySelector(UISelectors.doneBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline'; 

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
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                listItem.remove();
            });
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
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){

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

        //Delete Item click event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clearall Item click event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

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
            //Store in ls
            StorageCtrl.storeItem(newItem);
            //Clear fields
            UICtrl.clearInput();
        }
        
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
        //Update ls
        StorageCtrl.updateItemStorage(doneItem);
        //clear edit fields
        UICtrl.clearEditState();
        e.preventDefault();
    }

    //item delete submit
    const itemDeleteSubmit = function(e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //delete from ds
        ItemCtrl.deleteItem(currentItem.id);
        //delete from ui
        UICtrl.deleteListItem(currentItem.id);
        //Delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        //clear edit fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //item clear all submit
    const clearAllItemsClick = function(){
        
        //delete from ds
        ItemCtrl.clearAllItems();
        //delete from ui
        UICtrl.removeItems();
        //Remove from ls
        StorageCtrl.clearItemsFromStorage();
        //Hide ui
        UICtrl.hideList();
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
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();