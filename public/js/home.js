
$(document).ready(function () {
    
    // Selectors for the interactive elements on the page 
    let cacheBtn = $('#cache-btn');
    let cacheDiv = $('#cache-div');
    let redditDiv = $('#reddit-div');
    let redditBtn = $('#reddit-btn');
    let searchNav = $('#search-nav');
    let cardDeck = $('.card-deck');
    let redditQueryCol = $('.reddit-query-col');

    //hide the reddit div and show the search navigation for the cache page load
    redditDiv.hide();
    searchNav.show();

    // Get all snippets when the page loads
    $.ajax({
        url: '/getSnip/all',
        type: 'GET'
    }).done((selectedSnips) => {
        $('.card-deck').html(selectedSnips);
        cardDeck.show();
    });

    // Scroll to the search bar if there is an active session
    let user = sessionStorage.getItem('user');

    if (!user) {
        sessionStorage.setItem('user', 'active');
    } else {
        $('html, body').animate({
            scrollTop: $(cacheDiv).offset().top
        }, 'slow');
    }


    // Toggle feature for the personal cache divand reddit div
    cacheBtn.click(function () {
        if (!$(cacheDiv).is(":visible")) {
            cacheDiv.animate({
                width: 'toggle'
            });
            redditDiv.hide();
            redditQueryCol.empty().hide();
        }
    });

    redditBtn.click(function () {
        if (!$(redditDiv).is(":visible")) {
            redditDiv.animate({
                width: 'toggle'
            });
            cacheDiv.hide();
        }
    });

    // Highlight the button that is active
    if ($(cacheDiv).is(":visible")) {
        cacheBtn.addClass('border-white')
        redditBtn.addClass('border-white')
    }

    if ($(redditDiv).is(":visible")) {
        redditBtn.addClass('border-white')
        cacheDiv.addClass('border-white')
    }


    // Selectors for searching through reddit
    let searchredditBtn = $('#search-reddit-btn');
    let redditQuery = $('#search-reddit-input');


    //SELECTORS FOR PERSONAL CACHE BEGIN

    // Selectors for adding a new snippet to personal cache
    let newSnipName = $('#new-snip-name');
    let newSnipDesc = $('#new-snip-desc');
    let newSnipTag = $('#new-snip-tag');
    let addSnipBtn = $('#add-snip-btn');

    // Selector for user searching through a snippet in personal cache
    let searchTag = $('.searchTags');
    let getAllSnips = $('#get-all-snips');

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
        redditQueryCol.empty();

        if (redditQuery.val()) { 
            let parseQuery = redditQuery.val().replace(/\/./g, ''); // remove all slashes and dots
            let requrl = 'https://www.reddit.com/search.json?&limit=10&sort=hot&sort=new&q=';
            let fullurl = requrl + parseQuery;

            let queryHTML = '<div class="heading-font row w-100 justify-content-center display-4" style="var(--blue-color)">Results!</div>';

            $.getJSON(fullurl, function (json) {
                let myList = json.data.children;

                for (var i = 0, l = myList.length && 3; i < l; i++) {
                    let obj = myList[i].data;
                    let title = obj.title;
                    let subrdturl = 'http://www.reddit.com/r/' + obj.subreddit + '/';
                    let subrdt = obj.subreddit;

                    queryHTML += `<div class="row reddit-query-row m-2 justify-content-center col-lg-3 p-4">
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
                                </div>
                                `;
                }
                redditQueryCol.append(queryHTML);
                redditQuery.val('');
            });
        } else {
            redditQuery.addClass('border-danger');
        }

        console.log('hey'); 

    });

    // Remove the red on click if the user is correcting an empty request
    redditQuery.focus(function () {
        if (redditQuery.hasClass('border-danger')) {
            redditQuery.removeClass('border-danger');
        }
    });


    // allow the user to pull all the caches objects or one selected
    [searchTag, getAllSnips].forEach(function (el) {
        let param;

        el.click(function () {
            console.log(event.target.nodeName);
            if (event.target.nodeName === 'BUTTON') {
                param = 'all';
            } else {
                param = $(this).text();
            }

            $.ajax({
                url: `/getSnip/${param}`,
                type: 'GET'
            }).done((selectedSnips) => {
                $('.card-deck').html(selectedSnips);

            });

        });

    });

    // Button click event for when the user adds a snippet to their personal cache
    addSnipBtn.click(function () {
        event.preventDefault();
        if (newSnipName.val() && newSnipDesc.val() && newSnipTag.val()) {
            let snipObj = {
                snipName: newSnipName.val().trim(),
                snipDesc: newSnipDesc.val().trim(),
                snipTag: newSnipTag.val().trim(),
            };

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
                        newSnipName.val('');
                        newSnipDesc.val('');
                        newSnipTag.val('');
                        window.location.href = '/home';
                    } else {
                        alert('Bad Request');
                    }
                });
            } else {
                newSnipName.addClass('border-danger');
            }

        } else {
            // if any of the inputs are empty, highlight them red
            [newSnipName, newSnipDesc, newSnipTag].forEach(function (input) {
                if ($(input).val() === '') {
                    $(input).addClass('border-danger');
                }
            });
        }
    });

    // Remove border if user is correcting a wrong input
    [newSnipName, newSnipDesc, newSnipTag].forEach(function (input) {
        $(input).focus(function () {
            if ($(input).hasClass('border-danger')) {
                $(input).removeClass('border-danger');
            }
        });

    });



    // Add tag click event when adding to personal cache
    $(document).on('click', '.add-tag-btn', function () {

        let snip = $($(this)).closest('[data-ID]');
        let tagVal = snip.find('input');

        if (tagVal.val()) {

            let snipID = snip.data().id;

            let newTagObj = {
                newTag: tagVal.val().trim(),
                snipID: snipID
            };
            tagVal.val('');
            $.ajax({
                url: '/newSnipTag',
                type: 'POST',
                data: newTagObj
            }).done((newTag) => {
                if (newTag === 'Created') {
                    window.location.href = '/home';
                    tagVal.val('');
                }
            });
        } else {
            tagVal.addClass('border-danger')
        }

          //Remove red if correcting error
    tagVal.focus(function () {
        if (tagVal.hasClass('border-danger')) {
            tagVal.removeClass('border-danger');
        }
    });

    });



    // Remove a tag from a specific snippet in personal cache
    $(document).on('click', '.remove-cache-tag', function () {

        let badges = $(this).parents('.card').find('.cache-snippet-badge');

        for (let i = 0; i < badges.length; i++) {
            $(badges[i]).addClass('bg-danger');
            removeTagBool = true;
        }

    });

    // once a user has chosen remove tag, all tags become red and can then be selected for deletion
    $(document).on('click', '.cache-snippet-badge', function () {
        if (removeTagBool && $(this).hasClass('bg-danger')) {

            let deleteSnip = {
                snipID: $($(this)).closest('[data-ID]').data().id,
                removedTag: $(this).text()
            };

            // remove the red from the elements and turn off boolean
            $(this).removeClass('bg-danger');
            removedTagBool = false;

            $.ajax({
                url: '/delSnipTag',
                type: 'DELETE',
                data: deleteSnip
            }).done((delTag) => {
                if (delTag === 'Accepted') {
                    window.location.href = '/home';
                    removeTagBool = false;
                }
            });
        }
    });


    // route for deleting an entire snippet
    $(document).on('click', '.delete-snippet', function () {

        let snipID = $($(this)).closest('[data-ID]').data().id;

        $.ajax({
            url: `/delFullSnip/${snipID}`,
            type: 'DELETE',
        }).done((delSnip) => {
            if (delSnip === 'Accepted') {
                window.location.href = '/home';
            }
        });

    });


});





