/* eslint-disable */
$(document).ready(function () {

    // Selectors for the interactive elements on the page 
    let cacheBtn = $('#cache-btn');

    let cacheDiv = $('#cache-div');
    let homeContent = $('#home-main-content');


    // function onReady(callback) {
    //     var intervalId = window.setInterval(function () {
    //         if (document.getElementsByTagName('body')[0] !== undefined) {
    //             window.clearInterval(intervalId);
    //             callback.call(this);
    //         }
    //     }, 1000);
    // }

    // function setVisible(selector, visible) {
    //     document.querySelector(selector).style.display = visible ? 'block' : 'none';
    // }

    // onReady(function () {
    //     setVisible('.page', true);
    //     setVisible('#loading', false);
    // });


    // work around for page reloading
    let user = sessionStorage.getItem('user');
    sessionStorage.setItem('user', 'active');

    if (!user) {
        sessionStorage.setItem('user', 'active');
        homeContent.addClass('animated');
        cacheDiv.hide();
    } else {
        $.ajax({
            url: `/getSnip/all`,
            type: 'GET'
        }).done((selectedSnips) => {
            $('.card-deck').html(selectedSnips);
            homeContent.removeClass('animated');
            cacheDiv.show();

        })
    }

    // Toggle feature for the personal cache div
    cacheBtn.click(function () {
        cacheDiv.animate({
            width: 'toggle'
        });

    });

    // Selectors for searching through reddit
    let searchredditBtn = $('#search-reddit-btn');
    let redditQuery = $('#search-reddit-input');
    let redditClear = $('#reddit-clear-btn');

    // selectors to  populate the div with reddit queries
    let redditQueryRow = $('.redditQueryRow'); //add a new row with limited amount of queries
    let redditQueryCol = $('.reddit-query-col'); //append all queries to the row once the query has been made
    // each selectorsed to populate the new row
    let redditQueryTitle = $('.reddit-query-title')
    let redditQueryURL = $('.reddit-query-url')
    let redditQueryText = $('.reddit-query-text')


    //SELECTORS FOR PERSONAL CACHE BEGIN

    // Selectors for adding a new snippet to personal cache
    let newSnipName = $('#new-snip-name');
    let newSnipDesc = $('#new-snip-desc');
    let newSnipTag = $('#new-snip-tag');
    let addSnipBtn = $('#add-snip-btn');

    // Selector for user searching through a snippet in personal cache, filtered by either tag or text param - or both
    let searchTag = $('.searchTags');
    let clearTag = $('.clear-cache-search');

    // Flags for removing tags from personal cache
    let removeTagBool = false;

    // instantiate the list.js library for searching through the tags
    let options = {
        valueNames: ['searchTags']
    };
    let userList = new List('search-tags', options);



    // query reddit for some information
    // query reddit for some information
    searchredditBtn.click(function () {
        event.preventDefault();
        $('.reddit-query-col').empty(); 
        
        if (redditQuery.val()) {
            let parseQuery = redditQuery.val().replace(/\/./g, ''); // remove all slashes and dots
            let requrl = "https://www.reddit.com/search.json?&limit=10&sort=hot&sort=new&q=";
            let fullurl = requrl + parseQuery;

            let queryHTML = '<h4 class="heading-font" style="var(--blue-color)">Results!</h4>'; 

            $.getJSON(fullurl, function (json) {
                let myList = json.data.children;

                for (var i=0, l=myList.length && 3; i<l; i++) {
                    let obj = myList[i].data;
                    let title = obj.title;
                    let subrdturl = "http://www.reddit.com/r/"+obj.subreddit+"/";
                    let subrdt = obj.subreddit;

                    queryHTML += `<div class="row reddit-query-row m-2 justify-content-center">
                                    <div class="col-10 m-2 query-col">
                                        <h5 class="heading-font reddit-query-title">${subrdt}</h5>
                                    </div>
                                    <div class="col-10  m-2 query-col">
                                        <h5 class="heading-font">
                                        <a class="reddit-query-url" href="${subrdturl} " target="_blank">URL!</a>
                                    </h5>
                                    </div>
                                    <div class="col-10  m-2 query-col">
                                        <p class="content-font reddit-query-text">
                                        ${title}
                                        </p>
                                    </div>
                                </div>`
                }
                $('.reddit-query-col').append(queryHTML);
                redditQuery.val('') 
            });
        } else {
            alert('Cannot have empty query')
        }

    }); 

    // clear the reddit element
    redditClear.click(function () {
        event.preventDefault();
        $('.reddit-query-col').empty(); 
        redditQuery.val('') 

    });

    // PERSONAL CACHE FUNTIONALITY BEGINS

    // allow the user to pull all the caches objects or one selected
    [searchTag, clearTag].forEach(function (el) {
        el.click(function () {

            let param;
            console.log(event.target.nodeName)
            if (event.target.nodeName === 'BUTTON') {
                let value = $(this).parents('.input-group').children('.form-control').val();
                if (value === '') {
                    param = 'all'
                }
            } else {
                param = $(this).text()
            }

            $.ajax({
                url: `/getSnip/${param}`,
                type: 'GET'
            }).done((selectedSnips) => {

                $('.card-deck').html(selectedSnips)

            });

        })

    })

    // Button click event for when the user adds a snippet to their personal cache
    addSnipBtn.click(function () {
        event.preventDefault();
        if (newSnipName.val() && newSnipDesc.val() && newSnipTag.val()) {
            let snipObj = {
                snipName: newSnipName.val().trim(),
                snipDesc: newSnipDesc.val().trim(),
                snipTag: newSnipTag.val().trim(),
            }

            // make sure it is an email address
            let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            let regex = new RegExp(expression);
            let url = snipObj.snipName;

            if (url.match(regex)) {
                $.ajax({
                    url: '/newPersSnip',
                    type: 'POST',
                    data: snipObj
                }).done((addSnip) => {
                    if (addSnip === 'Created') {
                        console.log('Good creation');
                        newSnipName.val('');
                        newSnipDesc.val('');
                        newSnipTag.val('');
                        window.location.href = '/home';
                    } else {
                        alert('Bad Request')
                    }
                });
            } else {
                alert('That is not a URL');
            }

        } else {
            alert('No Fields can be empty');
        }
    });


    // Add tag click event when adding to personal cache
    $(document).on('click', '.add-tag-btn', function () {

        let snip = $($(this)).closest("[data-ID]");
        let tagVal = snip.find('input')

        if (tagVal.val()) {

            let snipID = snip.data().id

            let newTagObj = {
                newTag: tagVal.val().trim(),
                snipID: snipID
            }

            $.ajax({
                url: '/newSnipTag',
                type: 'POST',
                data: newTagObj
            }).done((newTag) => {

                console.log(newTag);


                if (newTag === 'Created') {
                    console.log('Good Tag creation');
                    window.location.href = '/home'
                    tagVal.val('')
                } else {
                    alert('Bad Request')
                }

            });
        } else {
            alert('Cannot add empty Tag')
        }
    });



    // Remove a tag from a specific snippet in personal cache
    $(document).on('click', '.remove-cache-tag', function () {

        let badges = $(this).parents('.card').find('.cache-snippet-badge');

        for (let i = 0; i < badges.length; i++) {
            $(badges[i]).addClass("bg-danger");
            removeTagBool = true;
        }

    })

    // once a user has chosen remove tag, all tags become red and can then be selected for deletion
    $(document).on('click', '.cache-snippet-badge', function () {
        if (removeTagBool && $(this).hasClass('bg-danger')) {

            let deleteSnip = {
                snipID: $($(this)).closest("[data-ID]").data().id,
                removedTag: $(this).text()
            }

            // remove the red from the elements and turn off boolean
            $(this).removeClass("bg-danger");
            removedTagBool = false;

            $.ajax({
                url: `/delSnipTag`,
                type: 'DELETE',
                data: deleteSnip
            }).done((delTag) => {
                if (delTag === 'Accepted') {
                    window.location.href = '/home'
                    console.log('Tag deleted');
                    removeTagBool = false;
                }
            });
        }
    });


    $(document).on('click', '.delete-snippet', function () {

        let snipID = $($(this)).closest("[data-ID]").data().id;

        $.ajax({
            url: `/delFullSnip/${snipID}`,
            type: 'DELETE',
        }).done((delSnip) => {
            if (delSnip === 'Accepted') {
                window.location.href = '/home'
                console.log('Snippet deleted');
            }
        });

    });


});





