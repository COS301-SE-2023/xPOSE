import {HomePage} from "./home.page"

describe('HomePage', () => {
    
   
    it('should display the current page name', () => {
        cy.get('#main-content').should('contain', 'xPose');
      });
    
      it('should display loading spinner initially', () => {
        cy.get('.loading-spinner').should('exist');
      });
    
      it('should populate cards with events', () => {
        // Mock an API response to populate events
        cy.intercept('GET', '**/e/events?uid=*', {
          fixture: 'events.json',
        }).as('getEvents');
    
        cy.wait('@getEvents'); 
    
        // Check if the cards are populated with event information
        cy.get('.event-card').should('have.length.greaterThan', 0);
      });
    
      it('should navigate to the search page when search button is clicked', () => {
        cy.get('.search-button').click();
    
        // Check if the URL has changed to the search page
        cy.url().should('include', '/search');
      });
    
      it('should navigate to the event details page when an event card is clicked', () => {
        // Mock an API response to populate events
        cy.intercept('GET', '**/e/events?uid=*', {
          fixture: 'events.json',
        }).as('getEvents');
    
        cy.wait('@getEvents');
    
        // Click the first event card (you can adjust this based on your UI structure)
        cy.get('.event-card').first().click();
    
        // Check if the URL has changed to the event details page
        cy.url().should('include', '/view-event/');
      });
    
      // Add more tests for other functionality as needed
    });

  
