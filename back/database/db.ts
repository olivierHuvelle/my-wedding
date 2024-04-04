import { PrismaClient } from '@prisma/client'
import { RoleCreateInput } from '../models/Role'
import { UserCreateInput } from '../models/User'
import { GuestCreateInput } from '../models/Guest'
import { EventCreateInput } from '../models/Event'
import { ContactCreateInput } from '../models/Contact'

const prisma = new PrismaClient().$extends({
  query: {
    role: {
      create({ args, query }) {
        args.data = RoleCreateInput.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = RoleCreateInput.partial().parse(args.data)
        return query(args)
      },
      updateMany({ args, query }) {
        args.data = RoleCreateInput.partial().parse(args.data)
        return query(args)
      },
      upsert({ args, query }) {
        args.create = RoleCreateInput.parse(args.create)
        args.update = RoleCreateInput.partial().parse(args.update)
        return query(args)
      },
    },
    user: {
      create({ args, query }) {
        args.data = UserCreateInput.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = UserCreateInput.partial().parse(args.data)
        return query(args)
      },
      updateMany({ args, query }) {
        args.data = UserCreateInput.partial().parse(args.data)
        return query(args)
      },
      upsert({ args, query }) {
        args.create = UserCreateInput.parse(args.create)
        args.update = UserCreateInput.partial().parse(args.update)
        return query(args)
      },
    },
    guest: {
      create({ args, query }) {
        args.data = GuestCreateInput.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = GuestCreateInput.partial().parse(args.data)
        return query(args)
      },
      updateMany({ args, query }) {
        args.data = GuestCreateInput.partial().parse(args.data)
        return query(args)
      },
      upsert({ args, query }) {
        args.create = GuestCreateInput.parse(args.create)
        args.update = GuestCreateInput.partial().parse(args.update)
        return query(args)
      },
    },
    event: {
      create({ args, query }) {
        args.data = EventCreateInput.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = EventCreateInput.partial().parse(args.data)
        return query(args)
      },
      updateMany({ args, query }) {
        args.data = EventCreateInput.partial().parse(args.data)
        return query(args)
      },
      upsert({ args, query }) {
        args.create = EventCreateInput.parse(args.create)
        args.update = EventCreateInput.partial().parse(args.update)
        return query(args)
      },
    },
    contact: {
      create({ args, query }) {
        args.data = ContactCreateInput.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = ContactCreateInput.partial().parse(args.data)
        return query(args)
      },
      updateMany({ args, query }) {
        args.data = ContactCreateInput.partial().parse(args.data)
        return query(args)
      },
      upsert({ args, query }) {
        args.create = ContactCreateInput.parse(args.create)
        args.update = ContactCreateInput.partial().parse(args.update)
        return query(args)
      },
    },
  },
})

export default prisma
