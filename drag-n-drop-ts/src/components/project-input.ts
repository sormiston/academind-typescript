import Component from "./base-component";
import * as ValidationLib from "../utils/validation";
import { projectState } from "../state/project";
import { autobind } from "../decorators/autobind";

export default class ProjectInput extends Component<
  HTMLDivElement,
  HTMLFormElement
> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", false, "user-input");

    this.titleInputElement = this.element.querySelector(
      "input#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "textarea#description"
    ) as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector(
      "input#people"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler); // prior to autobind, was this.submitHandler.bind(this)
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: ValidationLib.Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: ValidationLib.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const enteredPeopleValidatable: ValidationLib.Validatable = {
      value: enteredPeople,
      required: true,
      min: parseInt(this.peopleInputElement.getAttribute("min")!),
    };

    if (
      ValidationLib.validate(titleValidatable) ||
      ValidationLib.validate(descriptionValidatable) ||
      ValidationLib.validate(enteredPeopleValidatable)
    ) {
      return [enteredTitle, enteredDescription, +enteredPeople];
    } else {
      alert("Invalid input, please try again");
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    // Check if tuple (array) or void
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
    }
    this.clearInputs();
  }
}
