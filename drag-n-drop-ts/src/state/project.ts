import * as ProjectModel from "../models/project";

export type Listener = (items: ProjectModel.Project[]) => void;
export class ProjectState {
  private listeners: Listener[] = [];
  private projects: ProjectModel.Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects]);
    }
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new ProjectModel.Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectModel.ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectModel.ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }
}
export const projectState = ProjectState.getInstance();
