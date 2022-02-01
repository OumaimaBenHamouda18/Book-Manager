
/////////////////////////varibales declaration and intialisation//////////////////////
var highlightBtn= document.getElementById('highlight');
var highlights=document.querySelector('.highlightedItems');
var highlightInput=highlightBtn.previousElementSibling;
var quotes=document.querySelector('.quotes');
var quoteBtn=document.getElementById('quoteBtn');
var quoteInput=quoteBtn.previousElementSibling;
var author=document.querySelector('.author');
var bookName=document.getElementById('bookName');
var bookS=document.getElementById('summary');
var submitForm = document.querySelector('#submitForm');
var library=document.querySelector('#library');
var filter= document.getElementById('filter');
var error1 =document.getElementById('error1');
var error2 =document.getElementById('error2');


/////////////////////////Books Form//////////////////////

// event listener highlight button
highlightBtn.addEventListener('click',addHighlight);
highlightInput.addEventListener('keyup',addHighightWhenEnter);

function addHighightWhenEnter(e){
    e.preventDefault();
    if(e.keyCode==13){
        highlightBtn.click();
    }
}


// event listener quot button
quoteBtn.addEventListener('click',addQuote);
quoteInput.addEventListener('keyup',addQuoteWhenEnter)

function addQuoteWhenEnter(e){
    e.preventDefault();
    if(e.keyCode==13){
        quoteBtn.click();
    }
}

// event listener delete highlighted item
highlights.addEventListener('click',deleteHighlight);

//event listener input control
author.addEventListener('change',authorControl);


// event listener delete book
library.addEventListener('click',deleteBook);

// event listener filter book
filter.addEventListener('keyup',filterBook);


//display highlights function
function displayHighlights(){
    //create book list + styles
    highlightedItem=document.createElement('li');
    highlightedItem.className='list-group-item';
    highlightedItem.style.display='inline-block';
    highlightedItem.style.borderRadius= '30px';
    highlightedItem.style.borderColor='#f5f5f5';
    highlightedItem.style.backgroundColor='#f5f5f5'
    highlightedItem.style.marginRight='1.5em';
    highlightedItem.style.marginTop='12px';
    highlightedItem.appendChild(document.createTextNode(highlightInput.value));

    //create remove button + styles
    var delBtn=document.createElement('i');
     delBtn.className='fas fa-times delete';
     delBtn.style.color='red';
     delBtn.style.cursor='pointer';
     delBtn.style.marginLeft='.5em';
     highlightedItem.appendChild(delBtn);
    highlights.appendChild(highlightedItem);
    highlightInput.value='';

}
// addHighlight function
var highlightList=[];
function addHighlight(e){
    e.preventDefault();
    if(highlightInput.value!=''){
        //add highlights to the array
        highlightList.push(highlightInput.value);
        displayHighlights();
    }
}

//add Quote function
var quoteList=[];
function addQuote(e){
    e.preventDefault();
    if(quoteInput.value!=''){
        //add quotes to the array

        quoteBtn.innerHTML='added';
        quoteBtn.style.backgroundColor='green';
        setTimeout(function(){
            quoteBtn.innerHTML='add';
            quoteBtn.style.backgroundColor='';
        },500)
        quoteList.push(quoteInput.value);

        quoteInput.value='';
    }

}

// delete highlight function
function deleteHighlight(e)
{
    if(e.target.classList.contains('delete')){

            var li= e.target.parentElement;
            highlights.removeChild(li)

    }
}

// delete book function
function deleteBook(e)
{
    if(e.target.classList.contains('delete')){
            var li= e.target.parentElement;
            let i=0
            while(i<localStorage.length){
                const itemToDelete= JSON.parse(localStorage.getItem(localStorage.key(i))).bookName;
                if(itemToDelete==li.textContent)
                {
                    localStorage.removeItem(localStorage.key(i));
                    library.removeChild(li);
                    return;
                }
                i++;
            }

    }
}
// author control function
function authorControl(){
    if(!allLetters(author.value)){
        error1.innerHTML="";
        author.style.border='solid 2px red';
        error1.appendChild(document.createTextNode('Author name should only have letters'));
        error1.style.display='block';

    }else{
        error1.innerHTML=""; //removes error msg //doesnt work if span wascreated in DOM instead of html
        author.style.removeProperty('border'); //unsets red border when error occurs
        return 1;

    }

}

//al letters function
function allLetters(inputValue){
    letters=/^[a-zA-Z\s]*$/;
    if (letters.test(inputValue)){
        return true;
    }else{
        return false;
    }

}


/////////////////////////Library list//////////////////////

//add book event listener
submitForm.addEventListener('click',store);

//store function
function store(){

    if(bookName.value==''&&author.value==''){
        bookName.style.border='solid 2px red';
        author.style.border='solid 2px red';
        error1.appendChild(document.createTextNode('Author Name should not be empty'));
        error2.appendChild(document.createTextNode('Book Name should not be empty'));

    }

  else if(author.value==''){
    author.style.border='solid 2px red';
    error1.appendChild(document.createTextNode('Author Name should not be empty'));

  }
  else if(!authorControl()){
    authorControl();
  }

  else if(bookName.value==''){
    bookName.style.border='solid 2px red';
    error2.appendChild(document.createTextNode('Book Name should not be empty'));
}

  else{
  //store book data
  const bookN=bookName.value;
  const bookSummary=bookS.value;
  const authorN=author.value;
  const bookObj={
      bookName:bookN,
      author:authorN,
      bookSummary:bookSummary,
      highlights:highlightList,
      quotes:quoteList,
  };
 localStorage.setItem(bookObj.bookName,JSON.stringify(bookObj));
 location.reload()//element will be added to html on reload

//reset form input
 author.value='';
 bookName.value='';
 highlightBtn.previousElementSibling.value='';
 quoteBtn.previousElementSibling.value='';
 quotes.textContent='';
 highlights.textContent='';
 document.querySelector('textarea').value='';
  }

}


// filter books function
function filterBook(e){
var text= e.target.value.toLowerCase();
var matches=[];
    for(var i=0;i<localStorage.length;i++){
        var item=localStorage.key(i).toLowerCase()
        if (item.indexOf(text)!=-1){
            library.innerHTML='';
            matches.push(item);
        }
    }
    for(var i=0;i<matches.length;i++)
    {
        var addedBook=document.createElement('li');
        var trashIcon=document.createElement('i');
        trashIcon.className='fas fa-trash-alt float-end delete';
        addedBook.style.cursor='pointer';
        addedBook.className='list-group-item';
        addedBook.appendChild(document.createTextNode(matches[i]));
        addedBook.appendChild(trashIcon);
        library.appendChild(addedBook);

    }
    
    
}

//display books list onload
window.onload=displayBooks;

//display books function
function displayBooks(){
    for(let i=0;i<10;i++){
        if(i<localStorage.length){
            var key=localStorage.key(i);
        var item=JSON.parse(localStorage.getItem(key));
        var bookN=item.bookName;
        var addedBook=document.createElement('li');
        var trashIcon=document.createElement('i');
        trashIcon.className='fas fa-trash-alt float-end delete';
        addedBook.style.cursor='pointer';
        addedBook.className='list-group-item';
        addedBook.appendChild(document.createTextNode(bookN));
        addedBook.appendChild(trashIcon);
        library.insertBefore(addedBook,library.firstElementChild);
        library.firstElementChild=addedBook;
        }
        else{
            break;
        }
      }

        var lastLi=document.createElement('li');
         lastLi.appendChild(document.createTextNode('Search for more books'));
         lastLi.style.listStyle='none';
         lastLi.style.backgroundColor='#780206';
         lastLi.style.color='white';
         lastLi.style.textAlign='center';
         lastLi.style.padding='0.5rem';

         lastLi.style.cursor='pointer';
         var arrowUp=document.createElement('i');
         arrowUp.className="fas fa-arrow-up";
         arrowUp.style.paddingLeft='20px'
         lastLi.append(arrowUp);
         library.appendChild(lastLi)
         lastLi.addEventListener('click',function(){
             filter.focus();
         })
    }  
       
 
//open book event listener
library.addEventListener('click',openBook);

//openBook function
function openBook(e){
var i=0;
while(i<localStorage.length){
    var item=localStorage.getItem(localStorage.key(i))
    if(e.target.textContent==JSON.parse(item).bookName){
        sessionStorage.setItem('myTarget',e.target.textContent);
        sessionStorage.setItem('update','')

        window.open('book.html','_self');//_self to open file in the same tab
        return;
    }
    else{

        i++;
    }
}

}

function displayQuote(quoteContent){

   quote=document.createElement('li');
    quote.className='list-group-item';
    quote.style.display='inline-block';
    quote.style.borderRadius= '30px';
    quote.style.borderColor='#f5f5f5';
    quote.style.backgroundColor='#f5f5f5'
    quote.style.marginRight='1.5em';
    quote.style.marginTop='12px';
    quote.appendChild(document.createTextNode(quoteContent));

    var delBtn=document.createElement('i');
     delBtn.className='fas fa-times delete';
     delBtn.style.color='red';
     delBtn.style.cursor='pointer';
     delBtn.style.marginLeft='.5em';
     quote.appendChild(delBtn);
    quotes.appendChild(quote);

}

//updateBook function
function updateBook(){
    var key=sessionStorage.getItem('myTarget');
    var bookList=document.getElementById('bookList')
    var bookList=document.getElementById('bookList')
    var bookForm=document.getElementById('bookForm')

    bookList.style.display='none';
    bookForm.className='col-md-10';
    var itemToUpdate=JSON.parse(localStorage.getItem(key));
    bookName.value=JSON.parse(localStorage.getItem(key)).bookName;
    bookS.value=JSON.parse(localStorage.getItem(key)).bookSummary;
    author.value=JSON.parse(localStorage.getItem(key)).author;
    var highlightArray=JSON.parse(localStorage.getItem(key)).highlights;
    var quotesArray=JSON.parse(localStorage.getItem(key)).quotes;

//update highlights event listener 
highlights.addEventListener('click',updateH)

//update quotes event listener 
quotes.addEventListener('click',updateQ)

//update function event listener 
function updateH(e)
    {
        if(e.target.classList.contains('delete')){
            var i=0;
            while(i<highlightArray.length)
            {
                if(e.target.parentElement.textContent==highlightArray[i]){
                    highlightArray.splice(i,1);
                    itemToUpdate.highlights=highlightArray;
                    localStorage.setItem(key,JSON.stringify(itemToUpdate));
                    location.reload();
                    break;
                }
                else{
                    i++;
                }
            }
        }
    }


//update highlights event quotes
function updateQ(e)
{
    if(e.target.classList.contains('delete')){
        var i=0;
        while(i<quotesArray.length)
        {
            if(e.target.parentElement.textContent==quotesArray[i]){
                quotesArray.splice(i,1);
                itemToUpdate.quotes=quotesArray;
                localStorage.setItem(key,JSON.stringify(itemToUpdate));
                location.reload();
                break;
            }
            else{
                i++;
            }
        }
    }
}


    //add highlights
    for(var i=0;i<highlightArray.length;i++)
    {
        highlightList.push(highlightArray[i]);
        highlightInput.value=highlightArray[i];
        displayHighlights(highlightArray[i]);

    }

    //add quotes
    for(var i=0;i<quotesArray.length;i++){
        quoteList.push(quotesArray[i]);
        displayQuote(quotesArray[i]);
    }

    submitForm.innerHTML='Update Book';

    //update book event listener (store new data when update is clicked)
    submitForm.addEventListener('click',update);
    function update(e){
        store();
        window.open('book.html','_self');
        sessionStorage.getItem('update')='';

    }

}

//call update function if  localSession has key 'update'
if(sessionStorage.getItem('update')=='update me'){
    updateBook();
}















