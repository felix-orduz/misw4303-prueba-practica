import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { PlatoEntity } from 'src/plato/plato.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoCocina {
  ITALIANA = 'italiana',
  JAPONESA = 'japonesa',
  MEXICANA = 'mexicana',
  COLOMBIANA = 'colombiana',
  INDIANA = 'indiana',
  INTERNACIONAL = 'internacional'
}

@Entity()
export class RestauranteEntity {
  @ApiProperty({ description: 'The unique identifier of the restaurant' })
  @PrimaryGeneratedColumn('uuid')
  @Column({ type: 'uuid', primary: true })
  idRestaurante: string;

  @ApiProperty({ description: 'The name of the restaurant' })
  @Column()
  nombre: string;

  @ApiProperty({
    description: 'The type of cuisine',
    enum: TipoCocina,
    example: TipoCocina.ITALIANA
  })
  @Column({
    type: 'enum',
    enum: TipoCocina
  })
  tipoCocina: TipoCocina;

  @ApiProperty({ description: 'The address of the restaurant' })
  @Column()
  direccion: string;

  @ApiProperty({
    description: 'The dishes associated with the restaurant',
    type: () => [PlatoEntity]
  })
  @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes)
  platos: PlatoEntity[];
}
