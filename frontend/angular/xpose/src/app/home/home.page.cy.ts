import {HomePage} from "./home.page"

describe('HomePage', () => {
    
   
    it('should display the current page name', () => {
        cy.get('#main-content').should('contain', 'xPose');
      });
    
      it('should display loading spinner initially', () => {
        cy.get('.loading-spinner').should('exist');
      });
    
      it('should populate cards with events', () => {
        
        cy.intercept('GET', '**/e/events?uid=*', {
          fixture: 'events.json',
        }).as('getEvents');
    
        cy.wait('@getEvents'); 
    
        
        cy.get('.event-card').should('have.length.greaterThan', 0);
      });
    
      it('should navigate to the search page when search button is clicked', () => {
        cy.get('.search-button').click();
    
        
        cy.url().should('include', '/search');
      });
    
      it('should navigate to the event details page when an event card is clicked', () => {
        
        cy.intercept('GET', '**/e/events?uid=*', {
          fixture: 'events.json',
        }).as('getEvents');
    
        cy.wait('@getEvents');
    
       
        cy.get('.event-card').first().click();
    
        
        cy.url().should('include', '/view-event/');
      });
    
    });

  
