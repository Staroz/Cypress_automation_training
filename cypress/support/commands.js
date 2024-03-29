
import { getWSId, getId } from "./functions";
require('@4tw/cypress-drag-drop')

let workSpaceId, boardId, listId;
//LOGIN AND LOGOUT
Cypress.Commands.add('login', (email, pw, userName) => {
    cy.session('trelloLogin', () => {
        cy.visit('/home');
        cy.get('.Buttonsstyles__ButtonGroup-sc-1jwidxo-3 > [href="/login"]').click();
        cy.get('#user').type(email);
        cy.get('#login').click();
        cy.origin('https://id.atlassian.com', {args: {pw}}, ({pw}) => {
            cy.get('#password').type(pw);
            cy.get('#login-submit').click();
            });
        cy.url().should('contains', userName + '/boards')
    });
}); 

Cypress.Commands.add('logout', (userName)=> {
    cy.visit(`/u/" + ${userName} + "/boards`);
    cy.get('.u4D2jzA4ZiZ43J').should('be.visible').click({ force: true });
    cy.get('[data-testid="account-menu-logout"]').should('be.visible').click();
});

// HANDLING WORKSPACES AND BOARD WITH UI.
Cypress.Commands.add('createWorkSpace', (workSpaceName)=> {
    // I did triple-click for a bug in this button, the "force:true" method does not work.
    cy.get('[data-testid="header-create-menu-button"]').dblclick().click();
    cy.get('[data-testid="header-create-team-button"]').click();
    cy.get('[data-testid="header-create-team-name-input"]').should('be.visible').type(workSpaceName)
    cy.get('.css-191o3mb').click(); 
    cy.contains('Education').should('be.visible').click({force: true}); 
    cy.get('[data-testid="header-create-team-submit-button"]').should('be.visible').click();
    cy.get('[data-testid="show-later-button"]').click(); 
});

Cypress.Commands.add('deleteWorkSpace', (workSpaceName) => {
    cy.get('[data-testid="home-team-settings-tab"]').click();
    cy.get('[data-testid="delete-workspace-button"]').click();
    cy.get('#confirmWorkspaceName').type(workSpaceName);
    cy.wait(1500);
    cy.get('[data-testid="delete-workspace-confirm-button"]').click();
});

Cypress.Commands.add('createBoard', (boardName)=>{
    cy.get('[data-testid="header-create-menu-button"]').dblclick().click();
    cy.get('[data-testid="header-create-board-button"]').click();
    cy.get('[data-testid="create-board-title-input"]').type(boardName);
    cy.get('button[data-testid="create-board-submit-button"]').should('be.visible').click({force: true});
});

Cypress.Commands.add('modifyBoardName', (boardName, newBoardName)=> {
    cy.get('.board-tile-details-name').contains(boardName).first().click();
    cy.get('[data-testid="board-name-display"]').type(newBoardName+'{enter}');
});

Cypress.Commands.add('boardDelete', (boardName) => {
    cy.get('.board-tile-details-name').contains(boardName).click();
    cy.get('.frrHNIWnTojsww.GDunJzzgFqQY_3.bxgKMAm3lq5BpA.HAVwIqCeMHpVKh.SEj5vUdI3VvxDc').click({force: true});
    cy.get('.board-menu-navigation-item-link.js-open-more').click();
    cy.get('.board-menu-navigation-item-link.js-close-board').click({force: true});
    cy.get('.js-confirm.full.nch-button.nch-button--danger').click(); 
    cy.get('[data-testid="close-board-delete-board-button"]').click();
    cy.get('[data-testid="close-board-delete-board-confirm-button"]').click();
});

// LIST HANDLING WITH UI.
Cypress.Commands.add('createLists', (boardName, listNameArray) => {
    cy.get('.board-tile-details-name').contains(boardName).click();
    cy.get('.placeholder').click();
        for (let index = 0; index < listNameArray.length; index++) {
            cy.get('.list-name-input').type(listNameArray[index] +'{enter}');
        };
    cy.get('.icon-lg.icon-close.dark-hover.js-cancel-edit').click();
});

Cypress.Commands.add('deleteLists', (boardName) => {
    cy.get('.board-tile-details-name').contains(boardName).click();
    cy.get('[aria-label="List actions"]').then(($values) => {
        for (let index = $values.length; index > 0; index--) {
                cy.get('[aria-label="List actions"]').first().click();
                cy.get('.js-close-list').should('be.visible').click();
        }
    });
});

Cypress.Commands.add('archiveList', (boardName, listName) => {
    cy.get('.board-tile-details-name').contains(boardName).click();
    cy.contains('.list.js-list-content', listName).find('[aria-label="List actions"]').click();
    cy.get('.js-close-list').click();
});

// CARDS HANDLING WITH UI.
Cypress.Commands.add('createCards', (boardName, cardsNameArray) => {
    cy.get('.board-tile-details-name').contains(boardName).first().click();
    cy.get('.js-add-a-card').first().click();
        for (let index = 0; index < cardsNameArray.length; index++) {
            cy.get('.list-card-composer-textarea.js-card-title').type(cardsNameArray[index] +'{enter}');
        };
    cy.get('.icon-lg.icon-close.dark-hover.js-cancel').click();
});

Cypress.Commands.add('joinBoard', (userName, boardName) => {
    cy.visit(`/u/" + ${userName} + "/boards`);
    cy.get('.board-tile-details-name').contains(boardName).first().click();
});

Cypress.Commands.add('addDescriptionInCard', (cardName, descriptionText) => {
    cy.get('.list-card-title.js-card-name').contains(cardName).click();
    cy.get('[data-testid="click-wrapper"]').click().type(descriptionText);
    cy.contains('Save').click();
});

Cypress.Commands.add('addMember', (cardName, userName) => {
    cy.get('.list-card.js-member-droppable.ui-droppable').contains(cardName).click();
    cy.get('.js-sidebar-action-text').contains('Members').click();
    cy.get('.full-name').contains(userName).click();
    cy.get('.pop-over-header-close-btn.icon-sm.icon-close').click();
});

Cypress.Commands.add('addLabels', (cardName, labelColor) => {
    cy.get('.list-card-title.js-card-name').contains(cardName).click();
    cy.get('.js-sidebar-action-text').contains('Labels').click();
    cy.get(`[data-color="${labelColor}"]`).click();
    cy.get('[data-testid="popover-close"]').click();
});

Cypress.Commands.add('addChecklists', (cardName, checklistName) => {
    cy.get('.list-card.js-member-droppable.ui-droppable').contains(cardName).click();
    cy.get('.js-sidebar-action-text').contains('Checklist').click();
    cy.get('#id-checklist').invoke('val', checklistName);
    cy.get('input[value="Add"]').click();
});

Cypress.Commands.add('addCovers', (cardName, coverImageNumber) => {
    cy.get('.list-card.js-member-droppable.ui-droppable').contains(cardName).click();
    cy.get('.js-sidebar-action-text').contains('Cover').click();
    cy.wait(2000);
    cy.get('.k5qq0MRUdPmpWq').eq(coverImageNumber).click();
    cy.get('.pop-over-header-close-btn.icon-sm.icon-close').click()
});

Cypress.Commands.add('moveCard', ( cardName, listName) => {
    cy.get('.u-fancy-scrollbar.js-no-higher-edits.js-list-sortable.ui-sortable')
        .contains('.list.js-list-content', listName).as('element');
    cy.get('.list-card-details.js-card-details').contains(cardName).drag('@element');
});

Cypress.Commands.add('addAttachment', (cardName, attachmentLink, linkName) => {
    cy.get('.list-card-title.js-card-name').contains(cardName).click();
    cy.get('.Sc6pkrxVPpi79Q').click();
    cy.get('[data-testid="link-url"]').should('be.visible').type(attachmentLink, {delay: 0})
    cy.get('[data-testid="link-text"]').type(linkName, {delay: 0});
    cy.get('.css-178ag6o').contains('Insert').click({force: true});
});

Cypress.Commands.add('copyCard', (cardName, copyCardName, boardName, listName, cardPosition) => { 
    cy.get('.list-card-title.js-card-name').contains(cardName).click();
    cy.get('.js-sidebar-action-text').contains('Copy').click();
    cy.get('textarea.js-autofocus').type(copyCardName, {delay: 20});
    cy.get('select.js-select-board').select(`${boardName} (current)`);
    cy.get('select.js-select-list').select(listName);
    cy.get('select.js-select-position').select(cardPosition);
    cy.contains('Create card').click({force: true});
    cy.get('[aria-label="Close dialog"]').click();
});

Cypress.Commands.add('addLabelsAllCards', (listName, cardName, labelColor) => {
    cy.get('[data-testid="list"]').filter(`:contains(${listName})`).contains('.list-card-title.js-card-name', cardName).click();
    cy.get('.js-sidebar-action-text').contains('Labels').click();
    cy.get(`[data-color="${labelColor}"]`).click();
    cy.get('[data-testid="popover-close"]').click();
    cy.get('[aria-label="Close dialog"]').click();
});

Cypress.Commands.add('addMemberOfList', (listName, cardName, userName) => {
    cy.get('[data-testid="list"]').filter(`:contains(${listName})`).contains('.list-card-title.js-card-name', cardName).click();
    cy.get('.js-sidebar-action-text').contains('Members').click();
    cy.get('.full-name').contains(userName).click();
    cy.get('.pop-over-header-close-btn.icon-sm.icon-close').click();
    cy.get('[aria-label="Close dialog"]').click();
});

Cypress.Commands.add('cardsFilter', (filterCriteria, value) => {
    cy.get('[data-testid="filter-popover-button"]').click();
    if (filterCriteria === 'label') {
        cy.get('.css-pl72xp').click()
        cy.get(`div[data-color="${value}"]`).first().click();
        cy.get('[data-testid="popover-close"]').click();
    } else if (filterCriteria === 'member') {
        
        cy.get('.WiVSCg76W3ENQE').contains(value).click()
        cy.get('[data-testid="popover-close"]').click();
    } else if (filterCriteria === 'text') {
        cy.get('input.nch-textfield__input').type(value+'{enter}');
    } else {
        cy.get('[data-testid="popover-close"]').click();
    }
});

//MANAGEMENT WORKSPACES AND BOARD WITH API
Cypress.Commands.add('boardCreateApi', function(key, token, boardName) {
    cy.request({
        url: `${Cypress.env('urlApi')}/boards/?name=${boardName}&key=${key}&token=${token}`,
        method: 'POST',
        body: {
            defaultLists: false
        }
        }).then(function(response){
            expect(response.status).to.eq(200);
            boardId = response.body.id;
            cy.wrap(boardId).as('boardId');
            });
});

Cypress.Commands.add('boardUpdateApi', function(key, token, newBoardName) {
    cy.request({
        url: `${Cypress.env('urlApi')}/boards/${boardId}?&key=${key}&token=${token}&name=${newBoardName}`,
        method: 'PUT'
    }).then(response => {
        expect(response.status).to.eq(200);
        });
});

Cypress.Commands.add('boardDeleteApi', function(key, token) {
        cy.request({
        url: `${Cypress.env('urlApi')}/boards/${boardId}?key=${key}&token=${token}`,
        method: 'DELETE',
        }).then(response=>{
                expect(response.status).to.eq(200);
            });
    });

Cypress.Commands.add('getBoardId', function (key,token, boardName) {
    cy.request({
        url: `${Cypress.env('urlApi')}/members/me/boards?key=${key}&token=${token}`,
        method: "GET",
    }).then((response) => {
        expect(response.status).to.eq(200);
        boardId = getId(response.body, boardName);
        cy.wrap(boardId).as('boardId');
    });
});

Cypress.Commands.add('getWorkSpacedId', function (key,token, workSpaceName) {
    cy.request({
        url: `${Cypress.env('urlApi')}/members/me/organizations?key=${key}&token=${token}`,
        method: "GET",
    }).then((response) => {
        expect(response.status).to.eq(200);
        workSpaceId = getWSId(response.body, workSpaceName);
        cy.wrap(workSpaceId).as('workSpaceId');
    });
});

Cypress.Commands.add('workSpaceCreateApi', function(key, token, workSpaceName) {
    cy.request({
        url: `${Cypress.env('urlApi')}/organizations/?displayName=${workSpaceName}&key=${key}&token=${token}`,
        method: 'POST',
        }).then(function(response){
            expect(response.status).to.eq(200);
            workSpaceId = response.body.id;
            cy.wrap(workSpaceId).as('workSpaceId');
            });
});

Cypress.Commands.add('workSpaceDeleteApi', function(key, token) {
    cy.request({
    url: `${Cypress.env('urlApi')}/organizations/${workSpaceId}?key=${key}&token=${token}`,
    method: 'DELETE',
    }).then(response=>{
            expect(response.status).to.eq(200);
        });
});
Cypress.Commands.add('createListsApi', function(key, token, listNameArray ) {
    for (let index = listNameArray.length - 1; index > -1; index--) {
        cy.request({
            url: `${Cypress.env('urlApi')}/lists?name=${listNameArray[index]}&idBoard=${boardId}&key=${key}&token=${token}`,
            method: 'POST',
            }).then(response=>{
                    expect(response.status).to.eq(200);
                    listId = response.body.id;
                    console.log('1111', response.body);
                });
            }
            
});

Cypress.Commands.add('createCardApi', function(key, token, cardsNameArray ) {
    for (let index = cardsNameArray.length - 1; index > -1; index--) {
        cy.request({
            url: `${Cypress.env('urlApi')}/cards?name=${cardsNameArray[index]}&idList=${listId}&key=${key}&token=${token}`,
            method: 'POST',
            }).then(response=>{
                    expect(response.status).to.eq(200);
                });
            }
});

Cypress.Commands.add('createListsAndCardsApi', function(key, token, listNameArray, cardsNameArray ) {
    for (let index = listNameArray.length - 1; index > -1; index--) {
        cy.request({
            url: `${Cypress.env('urlApi')}/lists?name=${listNameArray[index]}&idBoard=${boardId}&key=${key}&token=${token}`,
            method: 'POST',
            }).then(response=>{
                    expect(response.status).to.eq(200);
                    listId = response.body.id;
                    for (let index = cardsNameArray.length - 1; index > -1; index--) {
                        cy.request({
                            url: `${Cypress.env('urlApi')}/cards?name=${cardsNameArray[index]}&idList=${listId}&key=${key}&token=${token}`,
                            method: 'POST',
                            }).then(response=>{
                                    expect(response.status).to.eq(200);
                                });
                            }
                });
            }
            
});



