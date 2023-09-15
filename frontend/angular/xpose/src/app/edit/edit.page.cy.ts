// cypress/integration/edit-page.spec.js

describe('EditPage', () => {
    beforeEach(() => {
      
      cy.visit('/edit');
    });
  
    it('should display the form with default values', () => {
      // Check if the form fields are visible and contain default values
      cy.get('input[name="username"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('input[name="isPublic"]').should('be.checked');
      cy.get('input[name="photoURL"]').should('have.value', '');
    });
  
    it('should update form fields when user interacts with them', () => {
      // Update form fields
      const username = 'John Doe';
      const email = 'john.doe@example.com';
  
      cy.get('input[name="username"]').type(username).should('have.value', username);
      cy.get('input[name="email"]').type(email).should('have.value', email);
      cy.get('input[name="isPublic"]').uncheck().should('not.be.checked');
      
    });
  
    it('should save changes and navigate to home page when "Save Changes" button is clicked', () => {
     
      cy.get('.save-button').click(); 
      cy.url().should('include', '/home');
    });
  
    it('should go back to the previous page when "Go Back" button is clicked', () => {
      
      cy.get('.back-button').click(); 
  
     
      cy.url().should('not.include', '/edit');
    });
  
  
  });
  