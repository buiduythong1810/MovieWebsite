//Get all dropdowns from the document
const dropdowns = document.querySelectorAll('.dropdown');

//Loop through all dropdown elements
dropdowns.forEach(dropdown =>{
        //Get inner elements from each dropdown
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');
        const options = dropdown.querySelectorAll('.menu li');
        const selected = dropdown.querySelector('.selected');
        /* Using this method in order to have multiple dropdown menus
        on the page work
        */
        //Add a click event to the select element
        select.addEventListener('click',() => {
              select.classList.toggle('select-clicked'); 
              caret.classList.toggle('caret-rotate');
              menu.classList.toggle('menu-open'); 
            
            
            }
            
        
        );
        options.forEach(option =>{
               option.addEventListener('click',()=>{
                   //Change selected inner text to clicked option inner text
                   selected.innerHTML = option.innerHTML;
                   //Add the clicked select styles to the select element
                   select.classList.remove('select-clicked');
                   //Add the rotate styles to the caret element
                   caret.classList.remove('caret-rotate');
                   //Add the open styles to the menu element
                   menu.classList.remove('menu-open');
                   options.forEach(options =>{
                     option.classList.remove('active');
                   });
                   option.classList.add('active');
                });
                
        });

    });
