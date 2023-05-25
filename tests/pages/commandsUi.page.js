
exports.Commands = class Commands {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    // general locators  
    this.page = page;
    this.pageOfBoards = page.goto('u/staroztesting/boards');
    this.confirmDeletedBoard = page.locator('[data-testid="close-board-big-message"]');
    // create a board
    this.createBoardBtn = page.locator('[data-testid="create-board-tile"]');
    this.fillBoardName = page.getByTestId('create-board-title-input');
    this.clickCreateBoard = page.getByTestId('create-board-submit-button');
    // update name of Board
    this.selectBoard = page.locator('[class="board-tile-details is-badged"]');
    this.currentBoardName = page.locator('[data-testid="board-name-display"]');
    this.updateBoardName = page.locator('[data-testid="board-name-input"]');
    // delete a board
    this.clickOptionsIcon = page.locator('[class="frrHNIWnTojsww GDunJzzgFqQY_3 bxgKMAm3lq5BpA HAVwIqCeMHpVKh SEj5vUdI3VvxDc"]');
    this.clickMoreOptions = page.locator('[class="board-menu-navigation-item-link js-open-more"]');
    this.clickCloseBoardBtn = page.locator('[class="board-menu-navigation-item-link js-close-board"]');   
    this.clickAlertBtn = page.locator('[class="js-confirm full nch-button nch-button--danger"]');   
    this.clickDeleteBoardBtn= page.locator('[data-testid="close-board-delete-board-button"]'); 
    this.clickConfirmDeleteBoardBtn= page.locator('[data-testid="close-board-delete-board-confirm-button"]'); 
  }

  async createBoard(boardName) {
  await this.createBoardBtn.click();
  await this.fillBoardName.fill(boardName);
  await this.clickCreateBoard.click();
  };

  async updateBoard(boardName, newBoardName) {
  await this.page.getByText(boardName).click();
  await this.currentBoardName.click();
  await this.updateBoardName.fill(newBoardName);
  await this.updateBoardName.press('Enter');
  };

  async deleteBoard(boardName) {
  await this.page.getByText(boardName).click();
  await this.clickOptionsIcon.click({force: true});
  await this.clickMoreOptions.click();
  await this.clickCloseBoardBtn.click({force: true});
  await this.clickAlertBtn.click(); 
  await this.clickDeleteBoardBtn.click();
  await this.clickConfirmDeleteBoardBtn.click();
  };
};
