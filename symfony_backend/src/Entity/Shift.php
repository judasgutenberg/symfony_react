<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Shift
 *
 * @ORM\Table(name="shift", indexes={@ORM\Index(name="manager_id", columns={"manager_id"}), @ORM\Index(name="employee_id", columns={"employee_id"})})
 * @ORM\Entity
 */
class Shift extends Model
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;
	public $employee;
	public $manager;
    /**
    * @var int
    *
    * @ORM\Column(name="manager_id", type="integer", nullable=false)
	* @ORM\JoinColumn(name="manager_id", referencedColumnName="id")
	* @ORM\ManyToOne(targetEntity="App\Entity\User", cascade={"persist"}, fetch="EAGER")
    */
    protected $managerId;

    /**
    * @var int
    *
    * @ORM\Column(name="employee_id", type="integer", nullable=false)
	* @ORM\JoinColumn(name="employee_id", referencedColumnName="id")
	* @ORM\ManyToOne(targetEntity="App\Entity\User", cascade={"persist"}, fetch="EAGER")
    */
    protected $employeeId;

    /**
     * @var float|null
     *
     * @ORM\Column(name="break", type="float", precision=10, scale=2, nullable=true)
     */
    protected $break;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="start_time", type="datetime", nullable=false)
     */
    protected $startTime;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_time", type="datetime", nullable=false)
     */
    protected $endTime;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    protected $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=false)
     */
    protected $updatedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getManagerId(): ?int
    {
        return $this->managerId;
    }

    public function setManagerId(?int $managerId): self
    {
        $this->managerId = $managerId;

        return $this;
    }

    public function getEmployeeId(): ?int
    {
        return $this->employeeId;
    }

    public function setEmployeeId(?int $employeeId): self
    {
        $this->employeeId = $employeeId;

        return $this;
    }

    public function getBreak(): ?float
    {
        return $this->break;
    }

    public function setBreak(?float $break): self
    {
        $this->break = $break;

        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeInterface $startTime): self
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeInterface $endTime): self
    {
        $this->endTime = $endTime;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }


}
