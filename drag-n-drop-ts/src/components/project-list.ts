import { autobind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop";
import * as ProjectModel from "../models/project";
import { projectState } from "../state/project";
import Component from "./base-component";
import ProjectItem from "./project-item";

export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: ProjectModel.Project[];

  constructor(private type: ProjectModel.ProjectStatus) {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }
  @autobind
  dragOverHandler(event: DragEvent) {
    // ensure that dragover data is text before calling event.preventDefault on dragover event
    // it is necessary to call event.preventDefault on dragover to allow for droppping
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }
  @autobind
  dropHandler(event: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
    const prjId = event.dataTransfer?.getData("text/plain");

    if (prjId) {
      projectState.moveProject(prjId, this.type);
    }
  }

  @autobind
  dragLeaveHandler(event: DragEvent) {
    console.log("dragleave", event.target);

    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: ProjectModel.Project[]) => {
      this.assignedProjects = projects.filter(
        (project) => project.status === this.type
      );
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const node of [...listEl.childNodes]) {
      node.remove();
    }
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(`${this.type}-projects-list`, prjItem);
    }
  }
}
