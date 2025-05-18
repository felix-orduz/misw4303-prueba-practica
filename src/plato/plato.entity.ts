import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

export enum CategoriaPlato {
  ENTRADA = 'entrada',
  PLATO_FUERTE = 'plato_fuerte',
  POSTRE = 'postre',
  BEBIDA = 'bebida'
}

@Entity()
export class PlatoEntity {
  @PrimaryGeneratedColumn('uuid')
  @Column({ type: 'uuid', primary: true })
  idPlato: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({
    type: 'enum',
    enum: CategoriaPlato,
    default: CategoriaPlato.PLATO_FUERTE
  })
  categoria: CategoriaPlato;

  @ManyToMany(
    () => RestauranteEntity,
    (restaurante) => restaurante.platos,
  )
  @JoinTable({
    name: 'plato_restaurante',
    joinColumn: {
      name: 'plato_id',
      referencedColumnName: 'idPlato',
    },
    inverseJoinColumn: {
      name: 'restaurante_id',
      referencedColumnName: 'idRestaurante',
    },
  })
  restaurantes: RestauranteEntity[];
}
