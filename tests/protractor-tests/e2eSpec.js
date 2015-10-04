/* globals browser, expect, element, by */

describe('Yodel', function() {
  var createButton = element(by.css('.create-button'));
  var joinButton = element(by.css('.join-button'));

  beforeEach(function() {
    browser.get('http://localhost:3030');
  });

  it('should create an event', function() {
    createButton.click();
    element(by.model('event')).sendKeys('yodelparty');
    var realCreateButton = element(by.css('.create-button'));
    realCreateButton.click();

    expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/events/yodelparty');
  });

  it('should join an event', function() {
    element(by.model('event')).sendKeys('yodelparty');
    joinButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/events/yodelparty');
  });

  it('should add songs to an event', function() {
    // first create the event
    createButton.click();
    element(by.model('event')).sendKeys('yodelparty');
    var realCreateButton = element(by.css('.create-button'));
    realCreateButton.click();

    // search for and add some songs
    element(by.css('.add-button')).click();

    element(by.model('searchTerm')).sendKeys('devo');
    element(by.css('.search-button')).click();

    var addButtons = element.all(by.css('.add-song'));
    addButtons.first().click();

    var showPlButton = element(by.css('.home-button'));
    showPlButton.click();

    // we expect the iframe player to exist
    var iframes = element.all(by.css('iframe'));

    expect(iframes.count()).toEqual(1);


    // we expect one song in songs
    var playlist = element.all(by.repeater('song in songs'));
    expect(playlist.count()).toEqual(1);

  });
});

/*

describe('Protractor Demo App', function() {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('latest'));
  var history = element.all(by.repeater('result in memory'));

  function add(a, b) {
    firstNumber.sendKeys(a);
    secondNumber.sendKeys(b);
    goButton.click();
  }

  beforeEach(function() {
    browser.get('http://juliemr.github.io/protractor-demo/');
  });

  it('should have a history', function() {
    add(1, 2);
    add(3, 4);

    expect(history.count()).toEqual(2);

    add(5, 6);

    expect(history.count()).toEqual(0); // This is wrong!
  });
});
*/
