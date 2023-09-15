// cypress/integration/profile-page.spec.js

describe('ProfilePage', () => {
    beforeEach(() => {
     
      cy.visit('/profile');
    });
  
    it('should display user information', () => {
      
      cy.get('.display-name').should('contain', 'loading...');
      cy.get('.email').should('contain', 'loading...');
      cy.get('.username').should('contain', 'loading...');
    });
  
    it('should navigate to the edit profile page when "Edit Profile" button is clicked', () => {
      
      cy.get('.edit-profile-button').click();
  
      
      cy.url().should('include', '/edit');
    });
  
    it('should navigate to the search page when "Search" button is clicked', () => {
      
      cy.get('.search-button').click();
  
      
      cy.url().should('include', '/search');
    });
  
    it('should navigate to the event details page when an event card is clicked', () => {
      
      const eventId = '12345';
  
      
      cy.get('.event-card').first().click();
  
      
      cy.url().should('include', `/view-event/${eventId}`);
    });
  
    
  });
  