import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm"
import type { Relation } from "typeorm"
import { PlayList } from "./playlist.entity"
@Entity()
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({type: "varchar",nullable:true})
  name!: string

  @Column({type: "varchar",nullable:false})
  url!: string

  @Column({type: "varchar",nullable:true})
  videoPath?: string

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date

  @Column({type: "varchar", nullable: false})
  playlistId!: string

  @Column({type: "varchar",nullable:true})
  rank?: string
  
  @ManyToOne(() => PlayList, (playlist) => playlist.videos)
  @JoinColumn({name: "playlistId"})
  playlist?: Relation<PlayList>

}
