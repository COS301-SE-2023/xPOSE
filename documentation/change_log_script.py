import os
import datetime
import subprocess

# Function to add a row to the markdown file
def add_change_log(markdown_file, document_name, changes_made):
    current_date = datetime.date.today().strftime("%Y-%m-%d")
    row = f"| {current_date} | {changes_made} |\n"

    with open(markdown_file, 'a') as file:
        file.write(row)

# Function to commit and push changes to Git
def commit_and_push_changes(markdown_file, document_name):
    try:
        subprocess.run(["git", "pull"])
        subprocess.run(["git", "add", markdown_file])
        subprocess.run(["git", "commit", "-m", f"Update {document_name}"])
        subprocess.run(["git", "push"])
        print("Changes committed and pushed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while committing and pushing changes: {e}")

# Prompt the user for markdown file name, document name, and changes made
while True:
    document_name = markdown_file = input("Enter the markdown file name: ")

    # Check if the markdown file exists
    if not os.path.isfile(markdown_file):
        create_choice = input(f"Markdown file '{markdown_file}' does not exist. Do you want to create it? (yes/no): ")
        if create_choice.lower() == "yes":
            # Create the markdown file
            document_header = input("Enter the document header: ")
            with open(markdown_file, 'w') as file:
                file.write(f"# {document_header} Change Log\n\n| Date       | Changes Made                            |\n|------------|-----------------------------------------|\n")
        else:
            retry_choice = input("Do you want to retry? (yes/no): ")
            if retry_choice.lower() == "no":
                print("Exiting the program.")
                break
            else:
                continue

    changes_made = input("Enter the changes made: ")

    # Print the initial contents of the markdown file
    with open(markdown_file, 'r') as file:
        initial_contents = file.read()
    print(f"\nInitial Contents of {markdown_file}:\n{initial_contents}\n")

    # Add the row to the markdown file
    add_change_log(markdown_file, document_name, changes_made)

    # Prompt the user if they want to commit and push the changes
    commit_choice = input("Do you want to commit and push your changes? (yes/no): ")

    if commit_choice.lower() == "yes":
        # Commit and push changes to Git
        commit_and_push_changes(markdown_file, document_name)
        break
    else:
        print("Changes not committed.")
        break
