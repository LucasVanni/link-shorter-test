export class RenderUser {
  id: string;
  name: string;
  email: string;

  constructor(user: { id: string; name: string; email: string }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
