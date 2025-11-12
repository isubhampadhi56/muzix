import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm"
import { Video } from "./video.entity"
import type { Relation } from "typeorm"
@Entity()
export class PlayList {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({type: "varchar",nullable:false})
  name!: string

  @Column({type: "varchar",nullable:true})
  location?: string

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date
  
  @OneToMany(() => Video, (video) => video.playlist)
  videos?: Relation<Video[]>

}
