import { Session } from "@/shared/types/session";

export class InMemorySessionStore {
  static #instance: InMemorySessionStore;

  private constructor() {
    this.sessions = new Map();
  }

  public static get instance(): InMemorySessionStore {
    if (!InMemorySessionStore.#instance) {
      InMemorySessionStore.#instance = new InMemorySessionStore();
    }

    return InMemorySessionStore.#instance;
  }

  private sessions: Map<string, Session>;


  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: Session) {
    this.sessions.set(id, session);
  }
}