import { Column, PrimaryGeneratedColumn } from "typeorm";

export class UserDeploy {
  @PrimaryGeneratedColumn()
  deploy_id: number;

  @Column()
  deploy_path: string;

  @Column()
  deploy_key: string;
}
