// cypress/integration/joined-event-page.spec.js

describe('JoinedEventPage Tests', () => {
  beforeEach(() => {
    // Load the Angular app's URL before each test
    cy.visit('https://xpose-4f48c.web.app/');
  });

  it('should display events after loading', () => {
    // Wait for events to load
    cy.get('.event-card').should('have.length.greaterThan', 0);
  });

  it('should filter events based on the status', () => {
    // Click the "Upcoming" filter button
    cy.get('.filter-button-upcoming').click();

    // Check if the events are filtered by "Upcoming" status
    cy.get('.event-card').each(($card) => {
      cy.wrap($card).contains('Upcoming');
    });
  });

  it('should navigate to the event details page when an event card is clicked', () => {
    // Click an event card
    cy.get('.event-card').first().click();

    // Check if the URL has changed to the event details page
    cy.url().should('include', '/view-event');
  });

  it('should navigate to the search page when "Search" button is clicked', () => {
    // Click the "Search" button
    cy.get('.search-button').click();

    // Check if the URL has changed to the search page
    cy.url().should('include', '/search');
  });

  it('should navigate to the create event page when "Create Event" button is clicked', () => {
    // Click the "Create Event" button
    cy.get('.create-event-button').click();

    // Check if the URL has changed to the create event page
    cy.url().should('include', '/create-event');
  });

  // Add more tests for other functionality as needed
});

    