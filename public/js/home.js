/* eslint-disable */
$(document).ready(function () {

    // Selectors for the interactive elements on the page 
    let cacheBtn = $('#cache-btn');

    let cacheDiv = $('#cache-div');

    //Hide the divs when the page loads
    cacheDiv.hide();

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


    // Remove a tag from snippet in personal cache
    let removeTagBtn = $('.remove-cache-tag');
    let cacheTag = $('.cache-snippet-badge');

    // delete entire snippet from personal cache
    let deleteSnip = $('.delete-snippet');


    // Flags for removing tags from personal cache
    let removeTagBool = false;

    // instantiate the list.js library for searching through the tags
    let options = {
        valueNames: ['searchTags']
    };
    let userList = new List('search-tags', options);



    // query reddit for some information
    searchredditBtn.click(function () {
        event.preventDefault();
        if (redditQuery.val()) {
            console.log(redditQuery.val());
            console.log('clear Reddit');
            redditQuery.val('')
        } else {
            alert('Cannot have empty query')
        }

    });

    // clear the reddit element
    redditClear.click(function () {
        event.preventDefault();
        console.log('clear Reddit');

    });

    // PERSONAL CACHE FUNTIONALITY BEGINS

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
                if (newTag === 'Created') {
                    console.log('Good Tag creation');
                    tagVal.val('')
                }

            });
        } else {
            alert('Cannot add empty Tag')
        }
    });

    // Remove a tag from a specific snippet in personal cache

    $(document).on('click', '.remove-cache-tag', function () {

        console.log($(this).closest('.card-header'))
        let badges = $(this).parents('.card').find('.cache-snippet-badge');

        console.log(badges)

        for (let i = 0; i < badges.length; i++) {
            $(badges[i]).addClass("bg-danger");
            removeTagBool = true;
        }

    })

    // once a user has chosen remove tag, all tags become red and can then be selected for deletion
    $(document).on('click', '.cache-snippet-badge', function () {
        if (removeTagBool && $(this).hasClass('bg-danger') ) {

            let deleteSnip = {
                snipID: $($(this)).closest("[data-ID]").data().id, 
                removedTag: $(this).text()
            }


          $(this).removeClass("bg-danger");
          removedTagBool = false; 

            $.ajax({
                url: `/delSnipTag`,
                type: 'DELETE',
                data: deleteSnip
            }).done((delTag) => {
                if (delTag === 'Accepted') {
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
                console.log('Snippet deleted');
            }
        });

    });


});


