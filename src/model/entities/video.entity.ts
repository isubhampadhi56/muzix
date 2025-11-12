import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm"
import type { Relation } from "typeorm"
import { PlayList } from "./playlist.entity"
@Entity()
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({type: "varchar",nullable:false})
  name!: string

  @Column({type: "varchar",nullable:false})
  url!: string

  @Column({type: "varchar",nullable:true})
  videoPath?: string

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date
  
  @ManyToOne(() => PlayList, (playlist) => playlist.videos)
  @JoinColumn({name: "id"})
  playlist?: Relation<PlayList>

}
