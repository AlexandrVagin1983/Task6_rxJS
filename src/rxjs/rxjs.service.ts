import { Injectable } from "@nestjs/common";
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from "rxjs";
import axios from "axios";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";
  private readonly gitlubURL = "https://gitlab.com/api/v4/projects?search=";

  private getGithub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.githubURL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        mergeAll(),
      )
      .pipe(take(count));
  }

  private getGitlub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.gitlubURL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        mergeAll(),
      )
      .pipe(take(count));
  }

  async searchRepositories(text: string, hub: string): Promise<any> {
    // Здесь можно добавить логику проверки на какой hub делать запрос
    console.log("hub = ", hub);
    if (hub == 'GitLab') {
      const data$ = this.getGitlub(text, 10).pipe(toArray());
      data$.subscribe(() => {});
      return await firstValueFrom(data$);
    }
    else {
      const data$ = this.getGithub(text, 10).pipe(toArray());
      data$.subscribe(() => {});
      return await firstValueFrom(data$);
    }    
  }
}
