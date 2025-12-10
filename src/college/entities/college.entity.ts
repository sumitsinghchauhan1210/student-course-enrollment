import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Student } from 'src/student/entities/student.entity';

@Table({ tableName: 'colleges' })
export class College extends Model {
  @Column({ allowNull: false })
  declare name: string;

  @HasMany(() => Student)
  students: Student[];
}
