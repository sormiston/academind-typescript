import { Draggable } from "../models/drag-drop";
import Component from "./base-component";
import { Project } from "../models/project";
import { autobind } from "../decorators/autobind";
export default class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @autobind
  dragEndHandler(event: DragEvent): void {
    console.log("dragend", event);
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
    this.element.addEventListener("dragleave", (event) => {
      event.stopPropagation();
    });
  }

  renderContent(): void {
    const h2 = this.element.querySelector("h2")! as HTMLHeadingElement;
    const h3 = this.element.querySelector("h3")! as HTMLHeadingElement;
    const p = this.element.querySelector("p")! as HTMLParagraphElement;

    h2.textContent = this.project.title;
    h3.textContent = this.personnel + " assigned";
    p.textContent = this.project.description;
  }

  get personnel() {
    return (
      this.project.people +
      " " +
      (this.project.people > 1 ? "persons" : "person")
    );
  }
}
