import { DropdownAlignmentEnum } from "../../components/dropdown/meta"
import { SizeEnum } from "../utils/core"

interface ICoreService {
  dropdownShown: boolean
  showDropdown(e: HTMLElement, alignment?: DropdownAlignmentEnum, size?: SizeEnum): void
  hideDropdown(): void
}

export type { ICoreService }
